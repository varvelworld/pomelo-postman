var pomelo = window.pomelo;

function connect(event) {
    var host = $("#host").val();
    var port = $("#port").val();
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function () {
        $("#connectingTip").html("connecting " + host + ":" + port);
        $("#send").attr("disabled", false).on("click", function () {
            var msg;
            switch ($("#msgType").val()) {
                case "json":
                    msg = JSON.parse($("#msg").val());
                    break;
                case "string":
                    msg = $("#msg").val();
                    break;
                default :
                    $("#msgType").parent().addClass("has-error");
                    return;
            }
            switch ($("#sendType").val()) {
                case "request":
                    pomelo.request($("#route").val(), msg, function (data) {
                        output("[RESPONSE] " + JSON.stringify(data));
                    });
                    break
                case "notify":
                    pomelo.notify($("#route").val(), msg);
                    break;
                default:
                    $("#sendType").parent().addClass("has-error");
                    return;
            }
        });
        var listeningPushRoutes = [];
        $("#listen").attr("disabled", false).on("click", function () {
            $.each(listeningPushRoutes, function (n, route) {
                pomelo.off(route);
            });
            listeningPushRoutes = [];
            $.each($("#pushRoutes").val().split(","), function (n, route) {
                listeningPushRoutes.push(route);
                pomelo.on(route, function (data) {
                    output("[PUSH] [" + route + "] " + JSON.stringify(data));
                });
            });
            $("#listeningPushRoutes").html("listening push routes: " + listeningPushRoutes.join(","));
        });
        $(event.target).val("disconnect").on("click", disconnect);
    });
    $(event.target).val("connecting").off("click");
}

function disconnect(event) {
    pomelo.disconnect();
    $("#connectingTip").html("");
    $(event.target).val("connect").off("click").on("click", connect);
    $("#send").off("click").attr("disabled", true);
    $("#listen").off("click").attr("disabled", true);
}

function output(log) {
    var datetime = new Date();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    $("#output").append("[" + hour + ":" + minute + ":" + second + "] " + log + "<br/>");
}

$(document).ready(function () {
    $("#connect").on("click", connect);
    $("#send").attr("disabled", true);
    $("#listen").attr("disabled", true);
    $("#clearOutput").click(function () {
        $("#output").html("");
    });
    $("#msgType").on("change", function(event) {
        $(event.target).parent().removeClass("has-error");
    });
    $("#sendType").on("change", function(event) {
        $(event.target).parent().removeClass("has-error");
    });
});