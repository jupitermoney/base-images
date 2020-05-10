FROM amazonlinux:2

RUN yum update -y && \
    yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm && \
    yum clean all && \
    rm -rf /var/cache/yum
WORKDIR /opt/amazon/ssm/
RUN curl -sLO https://inspector-agent.amazonaws.com/linux/latest/install
RUN /bin/bash install && rm -f install
CMD ["amazon-ssm-agent", "start"]