import sys
from transformers import BertTokenizer, BertModel

cache_dir=sys.argv[1]

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', cache_dir=cache_dir)
model = BertModel.from_pretrained("bert-base-uncased", cache_dir=cache_dir)
