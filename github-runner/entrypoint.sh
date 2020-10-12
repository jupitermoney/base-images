#!/bin/sh
REGISTRATION_URL="https://github.com/${GITHUB_OWNER}"
if [ -z "${GITHUB_REPOSITORY}" ]; then
    TOKEN_URL="https://api.github.com/orgs/${GITHUB_OWNER}/actions/runners/registration-token"
else
    TOKEN_URL="https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/actions/runners/registration-token"
    REGISTRATION_URL="${REGISTRATION_URL}/${GITHUB_REPOSITORY}"
fi

echo "Requesting registration URL at '${TOKEN_URL}'"

PAYLOAD=$(curl -sX POST -H "Authorization: token ${GITHUB_PERSONAL_TOKEN}" ${TOKEN_URL})
export RUNNER_TOKEN=$(echo $PAYLOAD | jq .token --raw-output)

if [ -z "${RUNNER_NAME}" ]; then
    RUNNER_NAME=$(hostname)
fi

sudo chown root:docker /var/run/docker.sock

./config.sh \
    --name "${RUNNER_NAME_PREFIX}${RUNNER_NAME}" \
    --token "${RUNNER_TOKEN}" \
    --url "${REGISTRATION_URL}" \
    --work "${RUNNER_WORKDIR}" \
    --labels "${RUNNER_LABELS}" \
    --unattended \
    --replace

remove() {
    PAYLOAD=$(curl -sX POST -H "Authorization: token ${GITHUB_PERSONAL_TOKEN}" ${TOKEN_URL%/registration-token}/remove-token)
    export REMOVE_TOKEN=$(echo $PAYLOAD | jq .token --raw-output)

    ./config.sh remove --unattended --token "${REMOVE_TOKEN}"
}

trap 'remove; exit 130' INT
trap 'remove; exit 143' TERM

./run.sh "$*" &

wait $!