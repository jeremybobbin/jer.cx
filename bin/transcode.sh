#!/bin/sh
: ${STREAM_DIR=srv/stream}
: ${STREAM_URL="rtsp://localhost:8554/stream"}
exec ffmpeg \
	-fflags nobuffer \
	-rtsp_transport udp \
	-i "$STREAM_URL" \
	-vsync 0 \
	-copyts \
	-vcodec copy \
	-movflags frag_keyframe+empty_moov \
	-an \
	-hls_flags delete_segments \
	-hls_list_size 1 \
	-f segment \
	-segment_list_flags live \
	-segment_time 2 \
	-segment_list_size 5 \
	-segment_wrap 20 \
	-segment_format mpegts \
	-segment_list "$STREAM_DIR/streaming.m3u8" \
	-segment_list_type m3u8 \
	"$STREAM_DIR/%d.ts"
