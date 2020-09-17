# Build
FROM golang:1.15 AS builder

WORKDIR /go/src/myemr

COPY . .

RUN go get -d -v ./...
RUN go build -v


# Runtime
FROM golang:1.15

WORKDIR /myemr

COPY ./assets ./assets
COPY ./cert ./cert
COPY ./templates ./templates
COPY ./wait-for-it.sh ./wait-for-it.sh
COPY --from=builder /go/src/myemr/myemr .

ENV MYSQL=imagedescription-db

ARG USER_ID
ARG GROUP_ID

RUN chown --changes --silent --no-dereference --recursive ${USER_ID}:${GROUP_ID} .
USER ${USER_ID}:${GROUP_ID}

CMD ["./myemr"]
