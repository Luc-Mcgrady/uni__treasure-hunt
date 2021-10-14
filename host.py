import flask
import os

def make_app(rundir):
	app = flask.Flask(__name__)

	def getfile(path):

		if path.endswith(".css"):
			mimetype="text/css"
		else:
			mimetype=None

		try: 
			with open(f"{rundir}/{path}", "rb") as f:

				

				return flask.Response(f.read(), mimetype=mimetype)
		except FileNotFoundError:
			return "", 404

	@app.route("/")
	def root():
		return getfile("root.html")

	@app.route("/<path:pth>")
	def all(pth):
		return getfile(pth)



	return app

if __name__ == "__main__":
	import build
	build.build()

	app = make_app("build")
	app.run("localhost",80)