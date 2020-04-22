FROM fluent/fluentd:v1.10-debian-1


# Use root account to use apt
USER root

# below RUN includes plugin as examples elasticsearch is not required
# you may customize including plugins as you wish
RUN buildDeps="sudo make gcc g++ libc-dev" \
 && apt-get update \
 && apt-get install -y --no-install-recommends $buildDeps \
 && sudo gem install ffi \
 && sudo gem install aws-sdk-s3 \
 && sudo gem install fluent-plugin-s3 \
 && sudo gem install fluent-plugin-prometheus \
 && sudo gem install fluent-plugin-multi-format-parser \
 && sudo gem install fluent-plugin-json-in-json-2 \
 && sudo gem install fluent-plugin-record-modifier \
 && sudo gem install fluent-plugin-detect-exceptions \
 && sudo gem install fluent-plugin-rewrite-tag-filter \
 && sudo gem install fluent-plugin-concat \
 && sudo gem install fluent-plugin-kinesis \
 && sudo gem install fluent-plugin-cloudwatch-logs \
 && sudo gem sources --clear-all \
 && SUDO_FORCE_REMOVE=yes \
    apt-get purge -y --auto-remove \
                  -o APT::AutoRemove::RecommendsImportant=false \
                  $buildDeps \
 && rm -rf /var/lib/apt/lists/* \
 && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

USER fluent
