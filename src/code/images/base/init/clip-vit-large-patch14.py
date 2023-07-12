import sys
from transformers import CLIPProcessor, CLIPModel

cache_dir=sys.argv[1]

model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14", cache_dir=cache_dir)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14", cache_dir=cache_dir)