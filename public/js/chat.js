window.onload = function() {
 

    var messages = [];
    var socket = io.connect('http://'+window.chat_domain+':'+window.chat_port);
    var chatform = document.getElementById("chatform");
    var field = document.getElementById("chatfield");
    var content = document.getElementById("chat");
 

    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data.message);
            if (messages.length > 300) {
                messages.shift();
            }
            var html = '';
            var i = messages.length;
            while (i--) {
                var msg = messages[i].replace(/&/g, '&amp;')
                                     .replace(/</g, '&lt;')
                                     .replace(/>/g, '&gt;')
                                     .replace(/"/g, '&quot;')
                                     .replace(/'/g, '&apos;');
                html += '<tr><td>' + msg + '</td></tr>';
            }
            content.innerHTML = html;
        }
    });
 

    var sendChat = function() {
        var text = field.value;
        socket.emit('chatback', { message: text, server: window.chat_server });
    };


    chatform.onsubmit = function(e) {
        e.preventDefault();
        sendChat();
        field.value = "";
    };
 

};