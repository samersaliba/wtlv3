$(function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "#nextprev {border-top: 1px solid var(--line-light);border-bottom: 1px solid var(--line-light);margin-top: 3em;}"
        + "#nextprev i {font-size: 2em;display: table-cell;vertical-align: middle;color: var(--line-light)}"
        + "#nextprev>div>div {display: table;padding: 2em 0 2em 0;text-align: center;cursor: pointer;}";
    document.getElementsByTagName('head')[0].appendChild(style);

    $("#nextprev").addClass("container").append(
        $("<div></div>").addClass("row").append(
            $("<div></div>")
                .addClass("col-md")
                .append('<i class="far fa-arrow-alt-circle-right"></i><div>المقال السابق</div>')
                .append($("#nextprev a")[0])
                .click(function (e) {
                    location = $(this).find("a").attr("href");
                })
        ).append(
            $("<div></div>").addClass("col-md")
                .append('<div>المقال اللاحق</div>')
                .append($("#nextprev a")[0])
                .append('<i class="far fa-arrow-alt-circle-left"></i>')
                .click(function (e) {
                    location = $(this).find("a").attr("href");
                })
        )
    );
})