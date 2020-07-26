divert(-1)
include(defs.m4)
divert(0)dnl
HTML
	HEAD
		CSS(/index.css) END
	END
	BODY(class="root")
	include(header.html.m4)dnl
	MAIN()
		divert(1)dnl
	END
	include(footer.html.m4)dnl
	END
END
divert(0)dnl
