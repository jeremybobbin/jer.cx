divert(-1)dnl
changequote(`[', `]')
changecom([#])

define([END], [CLOSER popdef([CLOSER])])
define(TAG, [define([$1], [<$2 $3>[]pushdef([CLOSER], [</$2>])])])
TAG([P], [p], [$*])
TAG([H1], [h1], [$*])
TAG([H2], [h2], [$*])
TAG([H3], [h3], [$*])
TAG([H4], [h4], [$*])
TAG([H5], [h5], [$*])
TAG([HTML], [html], [$*])
TAG([BODY], [body], [$*])
TAG([HEADER], [header], [$*])
TAG([FOOTER], [footer], [$*])
TAG([VIDEO], [video], [$*])
TAG([DIV], [div], [$*])
TAG([UL], [ul], [$*])
TAG([LI], [li], [$*])
TAG([IMG], [img], [$*])
TAG([BOLD], [strong])
TAG([LINK], [a], [href="$1", $2])
TAG([SCRIPT], [script], [ifelse($#, 0, [], [src="$1"])])
TAG([MAIN], [main])
divert(0)dnl