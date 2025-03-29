FROM ubuntu:latest
LABEL authors="kanghokim"

ENTRYPOINT ["top", "-b"]