import os
import re

def build(src = "src", dest = "build"):
	"""	
	This is desinged to make it easier to format files to export them to App Inventor.
	the folder "src" can only contain files and no directories as any files contained in the subdirectories will not be copied.
	This is because there are no directories in App Inventor.
	"""

	for filename in os.listdir(src):
		getpath = f"{src}/{filename}"
		putpath = f"{dest}/{filename}"
		
		if os.path.isfile(getpath):
			
			if getpath.endswith(".html"):
				with open(getpath, "r") as f:
					contents = f.read()
					
					contents = re.sub(r"(href|src)=\"((?!http)[^/].+)\"", "\\g<1>=\"http://localhost/\\g<2>\"", contents)

				with open(putpath, "w") as f:
					f.write(contents)

			else:
				with open(getpath, "rb") as r, open(putpath,"wb") as w:
					w.write(r.read())
					
			

if __name__ == "__main__":
	build()