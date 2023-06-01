rm mainServiceServer.js
webpack --config main_service_server.config_static.js
adb push mainServiceServer.js /userdata/aira/sw/service/.
