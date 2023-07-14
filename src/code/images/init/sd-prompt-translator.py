from transformers import MarianMTModel, MarianTokenizer
import sys

cache_dir=sys.argv[1]
model_name="Helsinki-NLP/opus-mt-zh-en"

MarianMTModel.from_pretrained(model_name, cache_dir=cache_dir)
MarianTokenizer.from_pretrained(model_name, cache_dir=cache_dir)