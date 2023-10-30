import json
import os
import re
import urllib.request
from datetime import datetime, timezone, timedelta

import modules.processing as processing
import modules.scripts as scripts
from modules import shared

tablestore_forward_endpoint = os.getenv("SERVERLESS_SD_FILEMGR_DOMAIN")
tablestore_token = os.getenv("SERVERLESS_SD_FILEMGR_TOKEN")
if tablestore_forward_endpoint:
    tablestore_forward_endpoint = "%s/%s" % (tablestore_forward_endpoint, "api/ots/forward_extension_data")

enable_extensions = os.getenv("ENABLE_TABLESTORE_EXTENSION")
print("tablestore_forward_endpoint:", tablestore_forward_endpoint, ", enable_extensions:", enable_extensions)


# noinspection PyMethodMayBeStatic,DuplicatedCode,PyBroadException,PyMethodOverriding
class Scripts(scripts.Script):

    def __init__(self) -> None:
        super().__init__()
        self.__re_param_code = r'\s*([\w ]+):\s*("(?:\\"[^,]|\\"|\\|[^\"])+"|[^,]*)(?:,|$)'
        self.__re_param = re.compile(self.__re_param_code)
        self.__re_imagesize = re.compile(r"^(\d+)x(\d+)$")

    def is_enabled(self) -> bool:
        return tablestore_forward_endpoint and enable_extensions and (enable_extensions not in ["", "0", "false"])

    def title(self):
        return "tablestore-sd-manager"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return []

    def postprocess(self, p: processing.StableDiffusionProcessing, processed: processing.Processed):
        if not self.is_enabled():
            return

        for index, image in enumerate(processed.images):
            data = dict()
            data["interrupted"] = shared.state.interrupted
            data["skipped"] = shared.state.skipped
            data["isTxt2Img"] = self.is_txt2img
            data["isImg2Img"] = self.is_img2img
            data['comments'] = getattr(processed, 'comments', None)
            job_timestamp = datetime.strptime(processed.job_timestamp, '%Y%m%d%H%M%S')
            data['usedTimeInSeconds'] = round(datetime.now().timestamp() - job_timestamp.timestamp())
            data['jobStartTime'] = job_timestamp.astimezone(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S")
            already_saved_as = getattr(image, 'already_saved_as', None)
            if already_saved_as.startswith("/"):
                data['imagePath'] = already_saved_as
            else:
                data['imagePath'] = "%s/%s" % (scripts.shared.data_path, already_saved_as) if already_saved_as is not None else None
            data['parameters'] = image.info['parameters']
            all_parameters = self.__parse_parameters(data['parameters'])
            data.update(all_parameters)
            self.__send_data(data)
        return

    def __send_data(self, data: dict):
        data_as_str = json.dumps(data, ensure_ascii=False)
        try:
            req = urllib.request.Request(url=tablestore_forward_endpoint, data=bytes(data_as_str, 'utf8'), method='POST')
            req.add_header('TOKEN', tablestore_token)
            with urllib.request.urlopen(req) as response:
                if 300 > response.getcode() >= 200:
                    print("Tablestore sd manager write data successfully! data:", data_as_str)
                else:
                    print("Tablestore sd manager write data failed, code:", response.getcode(), "content:", response.read(), "data:", data_as_str)
        except Exception as e:
            print("Tablestore sd manager write data failed, error:", e, "data:", data_as_str)

    def __unquote(self, text):
        if len(text) == 0 or text[0] != '"' or text[-1] != '"':
            return text
        try:
            return json.loads(text)
        except Exception:
            return text

    def __parse_parameters(self, x: str) -> dict:
        res = dict()

        prompt = ""
        negative_prompt = ""

        done_with_prompt = False

        *lines, lastline = x.strip().split("\n")
        if len(self.__re_param.findall(lastline)) < 3:
            lines.append(lastline)
            lastline = ''

        for line in lines:
            line = line.strip()
            if line.startswith("Negative prompt:"):
                done_with_prompt = True
                line = line[16:].strip()
            if done_with_prompt:
                negative_prompt += ("" if negative_prompt == "" else "\n") + line
            else:
                prompt += ("" if prompt == "" else "\n") + line

        res["Prompt"] = prompt
        res["Negative prompt"] = negative_prompt

        for k, v in self.__re_param.findall(lastline):
            try:
                if v[0] == '"' and v[-1] == '"':
                    v = self.__unquote(v)

                m = self.__re_imagesize.match(v)
                if m is not None:
                    res[f"Width"] = m.group(1)
                    res[f"Height"] = m.group(2)
                res[k] = v
            except Exception as e:
                print(f"Error parsing \"{k}: {v}\"", e)
        return res