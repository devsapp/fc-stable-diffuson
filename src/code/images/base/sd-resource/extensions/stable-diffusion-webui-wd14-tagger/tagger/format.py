"""Format module, for formatting output filenames"""
import re
import hashlib

from typing import Dict, Callable, NamedTuple
from pathlib import Path


class Info(NamedTuple):
    path: Path
    output_ext: str


def hashfun(i: Info, algo='sha1') -> str:
    try:
        hasher = hashlib.new(algo)
    except ImportError as err:
        raise ValueError(f"'{algo}' is invalid hash algorithm") from err

    with open(i.path, 'rb') as file:
        hasher.update(file.read())

    return hasher.hexdigest()


pattern = re.compile(r'\[([\w:]+)\]')

# all function must returns string or raise TypeError or ValueError
# other errors will cause the extension error
available_formats: Dict[str, Callable] = {
    'name': lambda i: i.path.stem,
    'extension': lambda i: i.path.suffix[1:],
    'hash': hashfun,

    'output_extension': lambda i: i.output_ext
}


def parse(match: re.Match, info: Info) -> str:
    matches = match[1].split(':')
    name, args = matches[0], matches[1:]

    if name not in available_formats:
        return match[0]

    return available_formats[name](info, *args)
