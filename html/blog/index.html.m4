define([TMP], maketemp(/tmp/m4-XXXXX))
syscmd([awk -F: '/^title:/ { sub(/\.md$/, "", FILENAME);
	printf "DIV(class=\"blog\") H1 LINK(/blog/%s.html)%s[]END END\nsyscmd(pandoc \"%s.md\") END BR\n",
	FILENAME, $2, FILENAME }' html/blog/*.md >] TMP)
include(TMP)
