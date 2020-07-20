include(base.m4)

SCRIPT
	var img = document.getElementById("cat");
	fetch('https://cataas.com/cat/cute')
		.then(response => response.blob())
		.then(image => img.src = URL.createObjectURL(image));
END

MAIN(class="main")
	IMG(id="cat") END
END
