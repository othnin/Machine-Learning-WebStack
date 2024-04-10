FROM python:3.10-slim-buster

RUN apt-get update && \
    apt-get install -y software-properties-common python3-pip python3-dev
    
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

ADD ./backend /app/backend
ADD ./docker /app/docker
ADD ./research /app/research
RUN pip3 install -r /app/docker/backend/requirements.txt

RUN mkdir -p /app/backend/server/static
EXPOSE 8000

ENTRYPOINT ["/app/docker/backend/wsgi-entrypoint.sh"]