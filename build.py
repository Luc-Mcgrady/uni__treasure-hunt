import os
import jinja2
import re
import json


def sub_urls(contents):
	return re.sub(r"(href|src)=\"((?!http)[^/].+)\"", "\\g<1>=\"http://localhost/\\g<2>\"", contents)


def render_template(contents, cfg):
	template = jinja2.Template(contents)
	contents = template.render(**cfg)

	contents = sub_urls(contents)

	return contents


def render(getpath, putpath, midfunc, *args):
	if getpath.endswith(".html"):
		with open(getpath, "r", encoding="utf8") as f:
			contents = f.read()

		contents = midfunc(contents, *args)

		with open(putpath, "w", encoding="utf8") as f:
			f.write(contents)

RESERVED_DIRS = [ "!templates", "!template_vals" ]

def build(src="src", dest="build"):
	"""
	This is designed to make it easier to format files to export them to App Inventor.

	Every template in the templates folder should have a corresponding json file of the same name in the templates folder which will be used to
	render the template with jinja2

	"""
	if not os.path.isdir(dest):
		os.mkdir(dest)

	for filename in os.listdir(src):
		get_path = f"{src}/{filename}"
		put_path = f"{dest}/{filename}"

		if os.path.isfile(get_path):
			if filename.endswith(".html"):
				render(get_path, put_path, sub_urls)
			else:
				with open(get_path, "rb") as r, open(put_path, "wb") as w:
					w.write(r.read())

	template_path = f"{src}/!templates"
	if os.path.isdir(template_path):
		for filename in os.listdir(template_path):
			put_path = f"{dest}/{filename}"
			get_path = f"{src}/!templates/{filename}"
			get_cfg_path = f"{src}/!template_vals/{'.'.join(filename.split('.')[:-1])}.json"

			with open(get_cfg_path, "r", encoding="utf8") as f:
				cfg = json.load(f)

			render(get_path, put_path, render_template, cfg)

	for dir in os.listdir(src):
		path = f"{src}/{dir}"

		if not os.path.isdir(path) or dir in RESERVED_DIRS:
			continue

		build(path) # Recursive for folders inside the build


if __name__ == "__main__":
	build()
