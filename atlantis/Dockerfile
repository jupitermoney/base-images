FROM runatlantis/atlantis:latest


ARG TF_COMPLIANCE_VERSION=1.1.16
RUN apk add --no-cache jq gcc build-base python3 \
    python3-dev libxml2-dev   \
    libxml2 libxslt-dev && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools awscli wheel && \
    pip install terraform-compliance==${TF_COMPLIANCE_VERSION} && \
    pip uninstall -y radish radish-bdd && \
    pip install radish radish-bdd && \
    mkdir -p /target

ENV LOCAL_BIN=/usr/local/bin

ARG TERRAGRUNT_VERSION="v0.23.14"
ADD https://github.com/gruntwork-io/terragrunt/releases/download/${TERRAGRUNT_VERSION}/terragrunt_linux_amd64 $LOCAL_BIN/terragrunt
RUN chmod +x $LOCAL_BIN/terragrunt

ARG SOPS_VERSION="v3.5.0"
ADD https://github.com/mozilla/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.linux $LOCAL_BIN/sops
RUN chmod +x $LOCAL_BIN/sops

ARG KUBECTL_VERSION="v1.17.0"
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl $LOCAL_BIN/kubectl
RUN chmod +x $LOCAL_BIN/kubectl