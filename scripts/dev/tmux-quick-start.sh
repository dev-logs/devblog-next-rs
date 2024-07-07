#! /bin/bash
tmux kill-session -t devblog || true && \
    tmux new-session -d -s devblog && \
    tmux split-window -hf \; \
    select-pane -T WEB -t 0 \; \
    select-pane -T API -t 1 && \
    tmux send-keys -t devblog:0.0 'yarn web:dev' C-m \; \
    send-keys -t devblog:0.1 'yarn api:dev' C-m \; \
    attach-session -t devblog
