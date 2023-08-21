import sys
from huggingface_hub import hf_hub_download

cache_dir=sys.argv[1]
model_name="Bingsu/adetailer"


for file in [
     "face_yolov8n.pt",
    "face_yolov8s.pt",
    "hand_yolov8n.pt",
    "person_yolov8n-seg.pt",
    "person_yolov8s-seg.pt",
]:
    hf_hub_download(model_name, file, cache_dir=cache_dir)