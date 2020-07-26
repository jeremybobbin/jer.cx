define([TMP], maketemp(/tmp/m4-XXXXX))
syscmd([awk -F: '/^title:/ { sub(/\.md$/, ".html", FILENAME);
	printf "DIV(class=\"blog\") H1 LINK(/blog/%s)%s[]END END\ninclude(%s) END BR\n",
	FILENAME, $2, FILENAME }' html/blog/*.md >] TMP)
include(TMP)
