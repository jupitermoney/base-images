# Version 1.0.4
FROM golang:alpine AS builder
RUN apk add --no-cache gcc libc-dev git
WORKDIR /go/src/app
RUN wget -q https://raw.githubusercontent.com/fluent/fluent-bit/master/conf/plugins.conf && \
     echo "Path /fluent-bit/plugins/out_coralogix.so" | tee -a plugins.conf
# RUN wget -q https://raw.githubusercontent.com/coralogix/integrations-docs/master/integrations/fluent-bit/plugin/out_coralogix.go && \
#     wget -q https://raw.githubusercontent.com/coralogix/integrations-docs/master/integrations/fluent-bit/plugin/go.mod && \
#     wget -q https://raw.githubusercontent.com/coralogix/integrations-docs/master/integrations/fluent-bit/plugin/go.sum && \
#     go mod vendor && \
#     go build -buildmode=c-shared -ldflags "-s -w" -mod=vendor -o out_coralogix.so .
RUN wget https://raw.githubusercontent.com/coralogix/integrations-docs/master/integrations/fluent-bit/plugin/out_coralogix.so .

FROM amazon/aws-for-fluent-bit:latest
COPY --from=builder /lib/libc.musl-x86_64.so* /lib64/
COPY --from=builder /go/src/app/out_coralogix.so /fluent-bit/

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
