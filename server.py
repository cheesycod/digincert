#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import json
import os


import json5

data = {}

for exp in os.listdir("physics"):
    if os.path.isdir(f"physics/{exp}"):
        print(exp)
        data[exp] = json5.load(open(f"physics/{exp}/info.json5"))
        
json.dump(data, open("physics/info.min.json", "w"))


class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
