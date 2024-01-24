# reference:
#     https://signoz.io/docs/instrumentation/fastapi/


# Install signoz with docker method

git clone -b main https://github.com/SigNoz/signoz.git
cd signoz/deploy/

# Remove the Sample Application from SigNoz Dashboard
# open Docker Compose file deploy/docker/clickhouse-setup/docker-compose.yaml in a plain-text editor.
# Comment out or remove the services.hotrod and services.load-hotrod sections

docker compose -f docker/clickhouse-setup/docker-compose.yaml up -d

## When you are done installing SigNoz, you can access the UI at: http://localhost:3301

# Sqlaclhemy tracing requires psycopg2
# psycopg2-binary is not supported by opentelemetry auto instrumentation libraries as it is not \
# recommended for production use. Please use psycopg2 to see DB calls also in your trace data in SigNoz
pip install psycopg2 opentelemetry-instrumentation-psycopg2

# run the command below after installing requirements
# Please make sure that you have installed all the dependencies of your application before running the below \
# command. The command will not install instrumentation for the dependencies which are not installed.
opentelemetry-bootstrap --action=install

# The run application
# Don’t run app in reloader/hot-reload mode as it breaks instrumentation. For example, if you use --reload \
# or reload=True, it enables the reloader mode which breaks OpenTelemetry isntrumentation.

opentelemetry-instrument --traces_exporter console pnpm server:uv:watch
