FROM golang:1.15 AS builder

WORKDIR /go/src/myemr

COPY . .

RUN go get -d -v ./...
RUN go build -v


FROM golang:1.15

WORKDIR /myemr

COPY ./assets ./assets
COPY ./cert ./cert
COPY ./templates ./templates
COPY ./wait-for-it.sh ./wait-for-it.sh
COPY --from=builder /go/src/myemr/myemr .

ENV MYSQL=myemr-db

CMD ["./myemr"]
