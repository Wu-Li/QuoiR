
var Q = Q || {};
Q.models = {};
Q.lines = [];
Q.li = 0;
Q.panels = {};

$( function () { 
  $("#tabs i").after("<br>");
  
  //Console
  Q.console = $("#console");
  Q.console.map = $("#consoleMap");
  Q.panels.console = $("#console-panel");
  Q.panels.console.nice = Q.panels.console.niceScroll({ 
      cursorwidth:'5px',
      cursorborder:'groove rgba(200,200,200,0.25)',
      railalign:'left'
  });
  Q.panels.console.on('change', function() { 
      $("pre.in").before("<hr>");
      if(Q.console.height() > Q.panels.console.height()){
        Q.console.css("position","relative");
        Q.panels.console.nice.resize();
        Q.panels.console.nice.doScrollTo(Q.console.height());    
      } else {
        Q.console.css("position","absolute");
      }
  }); 
  
  //Prompt
  Q.prompt = $("#prompt");
  $(document).keydown( function(e) {
        switch (e.keyCode) {
            case 192://grave
                Q.prompt.focus();
                return false;
        }
  });
  Q.prompt.keydown( function(e) {
        switch (e.keyCode) {
                case 13://enter
                var entry = this.value;
                if (entry) {
                    Q.lines.push(entry);
                    Q.li = 0;
                    $('#submit').click();
                }
                break;
            case 38://up
                if (Q.lines.length == 0) {break;}
                if (Q.li == 0) {
                    Q.li = (Q.lines.length - 1);
                } else { Q.li--; }
                this.value = Q.lines[Q.li];
                return false;
            case 40://down
                if (Q.lines.length == 0) {break;}
                if (Q.li == Q.lines.length - 1) {
                    Q.li = 0;
                } else { Q.li++; }
                this.value = Q.lines[Q.li];
                return false;
        }
  });
  Q.prompt.focus();
  
  $(window).resize( function() {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var ph = $("#panelHeight");
        var pw = $("#panelWidth");
        var c = w - $('#prompt-box + .tabs-above').width();
        pw.val(c/8);
        ph.val(h);
        $("#panels + .tab-content").css("width",c);
  });
  
  $("#prompt-box + .tabs-above").resizable({
    alsoResize: "#tabs, .active .qmap, #prompt-box + .tabs-above",
    handles:"w",
    minWidth: 300,
    containment: 'parent',
    animate:true,
    start: function (event, ui){
        $("#help").each(function (index, element) {
            var d = $('<div class="iframeCover" style="z-index:99;position:absolute;width:100%;top:0px;left:0px;height:' + $(element).height() + 'px"></div>');
            $(element).append(d);
        });
    },
    stop: function (event, ui) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var ph = $("#panelHeight");
        var pw = $("#panelWidth");
        c = w - ui.size.width;
        pw.val(c/8);
        ph.val(h);
        Shiny.onInputChange("panelWidth",pw.val());
        Shiny.onInputChange("panelHeight",ph.val());
        $("#panels + .tab-content").css("width",c);
        $('.iframeCover').remove();
    }
  });
  $(window).resize();
});