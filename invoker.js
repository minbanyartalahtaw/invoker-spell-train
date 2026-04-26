var boardWidth = 400,
  boardHeight = 400,
  boxSize = 100;

var level = 2,
  points = 0;

var timeoutHandler;

var spells = {
  QQQ: { name: "cold", key: "QQQ" },
  QQW: { name: "ghost", key: "QQW" },
  QWW: { name: "tornado", key: "QWW" },
  WWW: { name: "emp", key: "WWW" },
  EWW: { name: "alacrity", key: "WWE" },
  EQW: { name: "blast", key: "QWE" },
  EEW: { name: "meteor", key: "EEW" },
  EQQ: { name: "wall", key: "QQE" },
  EEQ: { name: "spirit", key: "EEQ" },
  EEE: { name: "sun", key: "EEE" },
};
var spellKeys = Object.keys(spells);

function createFallBox() {
  var nextTime = 3500 / level;
  timeoutHandler = setTimeout(function () {
    var spellKey = spellKeys[Math.floor(Math.random() * spellKeys.length)];
    var spell = spells[spellKey].name;
    var $box = $(
      '<div class="box ' + spell + '">' + spells[spellKey].key + "</div>"
    ).appendTo(".board");
    
    var left = Math.floor(boxSize * (Math.random() * 3)) + "px";
    var duration = 13000 / level;
    var distance = boardHeight + boxSize + 50;

    $box.css({
      top: "-" + boxSize + "px",
      left: left,
      transform: "translateY(0)",
      transition: "none",
      willChange: "transform"
    });

    // Force reflow so the next transform animates from the starting point
    $box[0].offsetHeight;

    $box.css({
      transition: "transform " + duration + "ms linear",
      transform: "translateY(" + distance + "px)"
    });

    setTimeout(function () {
      $box.remove();
    }, duration);

    createFallBox();
  }, nextTime);
}

createFallBox();

$(document).on("keydown", function (e) {
  var code = e.keyCode || e.which;
  var letter = "";
  switch (code) {
    case 81: letter = "Q"; break;
    case 90: letter = "Q"; break; // Support Z (French keyboard)
    case 87: letter = "W"; break;
    case 69: letter = "E"; break;
    case 82: letter = "R"; break;
  }

  if (letter) {
    if (letter == "R") {
      $(".invoke").addClass("active");
      setTimeout(function() { $(".invoke").removeClass("active"); }, 100);

      // get letters from current orbs
      var currentOrbs = "";
      $(".normal .hability").each(function() {
        if ($(this).hasClass("Q")) currentOrbs += "Q";
        if ($(this).hasClass("W")) currentOrbs += "W";
        if ($(this).hasClass("E")) currentOrbs += "E";
      });

      if (currentOrbs.length == 3) {
        var spellKey = currentOrbs.split("").sort().join("");
        var spellName = spells[spellKey].name;
        var match = $(".box." + spellName).first();
        
        if (match.length == 1) {
          points += 1;
          
          // Animate score
          $(".points").text(points).addClass("pulse");
          setTimeout(function() { $(".points").removeClass("pulse"); }, 400);
          
          // Animate hit
          match.addClass("hit").fadeOut(100, function() {
            $(this).remove();
          });
        }
      }
    } else {
      if ($(".normal .hability").length == 3) {
        $(".normal .hability").first().remove();
      }
      var $newHability = $('<div class="hability ' + letter + '">' + letter + "</div>")
        .appendTo(".habilities .normal");
      
      // Visual feedback for the new orb
      $newHability.addClass("active");
      setTimeout(function() { $newHability.removeClass("active"); }, 100);
    }
  }
});

$(".speed-slider").on("input", function () {
  level = parseFloat($(this).val());
  $(".speed-value").text(level.toFixed(1) + "x");
  clearTimeout(timeoutHandler);
  createFallBox();
});
