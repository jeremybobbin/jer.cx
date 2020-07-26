include(base.m4)
DIV(class="about")
	DIV(class="me")
		H1 About Me END
		DIV(class="jer-face-wrapper") 
			IMG(src="/public/jer.jpeg" class="jer-face")
		END
		P(class="first") 
				I'm Jeremy and I'm 22 years old. I was born and raised in Orlando, Florida. LINK("resume.pdf")This END is my resume.
		END
		BR
		P 
			I enjoy optimizing my own work flow through the use of the modular and exstensible Unix core utilities. LINK("mailto:jer@jer.cx") Email me END.
		END
		BR
		P 
				I like keyboard-driven applications, like LINK("https://www.vim.org") Vim END, LINK("https://www.qutebrowser.org") Qutebrowser END and LINK("https://dwm.suckless.org/") DWM END.
		END
		BR
	END
	DIV className="this-site" 
		H1 About This Site END
		P(class="first")
			This site is written in LINK("https://en.wikipedia.org/wiki/M4_(computer_language)") M4 END, served with the help of LINK("https://tools.suckless.org/quark/") Quark END, a web server written in LINK("https://en.wikipedia.org/wiki/ANSI_C") ANSII C END. This site is actively developed, maintained and deployed on LINK("https://www.archlinux.org/") Arch Linux END.
		END
		IMG(src="/public/arch.png" class="arch") END
	END
END
