FROM tiangolo/uvicorn-gunicorn:python3.10-slim
LABEL maintainer="Sebastian Ramirez <tiangolo@gmail.com>"

COPY /felicity_lims/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

WORKDIR /app/
COPY ./felicity_lims /app
ENV PYTHONPATH=/app
