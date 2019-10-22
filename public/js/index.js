var mileage = 0;
var batting = false;
$(function(){
    var jsonList = [];
    $('.button--bubble').each(function() {
        var $circlesTopLeft = $(this).parent().find('.circle.top-left');
        var $circlesBottomRight = $(this).parent().find('.circle.bottom-right');
      
        var tl = new TimelineLite();
        var tl2 = new TimelineLite();
      
        var btTl = new TimelineLite({ paused: true });
      
        tl.to($circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
        tl.to($circlesTopLeft.eq(0), 0.1, { scale: 0.2, x: '+=6', y: '-=2' });
        tl.to($circlesTopLeft.eq(1), 0.1, { scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
        tl.to($circlesTopLeft.eq(2), 0.1, { scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
        tl.to($circlesTopLeft.eq(0), 1, { scale: 0, x: '-=5', y: '-=15', opacity: 0 });
        tl.to($circlesTopLeft.eq(1), 1, { scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
        tl.to($circlesTopLeft.eq(2), 1, { scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');
      
        var tlBt1 = new TimelineLite();
        var tlBt2 = new TimelineLite();
        
        tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
        tlBt1.add(tl);
      
        tl2.set($circlesBottomRight, { x: 0, y: 0 });
        tl2.to($circlesBottomRight, 1.1, { x: 30, y: 30, ease: SlowMo.ease.config(0.1, 0.7, false) });
        tl2.to($circlesBottomRight.eq(0), 0.1, { scale: 0.2, x: '-=6', y: '+=3' });
        tl2.to($circlesBottomRight.eq(1), 0.1, { scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
        tl2.to($circlesBottomRight.eq(2), 0.1, { scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
        tl2.to($circlesBottomRight.eq(0), 1, { scale: 0, x: '+=5', y: '+=15', opacity: 0 });
        tl2.to($circlesBottomRight.eq(1), 1, { scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
        tl2.to($circlesBottomRight.eq(2), 1, { scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');
        
        tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: 45 });
        tlBt2.add(tl2);
      
        btTl.add(tlBt1);
        btTl.to($(this).parent().find('.button.effect-button'), 0.8, { scaleY: 1.1 }, 0.1);
        btTl.add(tlBt2, 0.2);
        btTl.to($(this).parent().find('.button.effect-button'), 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);
      
        btTl.timeScale(2.6);
      
        $(this).on('mouseover', function() {
          btTl.restart();
        });
      });

    $("#startGame").click(function(){
        hideAnimate();
        $("#Main").show()
        $("#Main").animate({
            width:"800px",
            height: "600px",
            opactity: 0.5
        }, 1000);

        getQuestions(function(data){
            makeForm(data);
        }, $("#idx").val() || 0);
    });

    $("#nextGame").click(function(){
        var index = parseInt($("#idx").val()) + 1;
        if(index == 4) {
            $("#Main").hide();
            $("#finish_mileage").text(mileage)
            $("#finish").show();
            $("#finish").animate({
                width:"800px",
                height: "600px",
                opactity: 0.5
            }, 1000);
            return;
        }
        getQuestions(function(data){
            $(".qna").hide();
            $("#question_" + index).show();
            $(".answer_area_" + index).show();
            makeForm(data);
        }, index);
    }); 

    $("#reGame").click(function(){
        $("#Main").removeClass("disableDiv");
        $("#wrong").hide();
        var index = $("#idx").val();
        if (index == 4) {
            return;
        }
        getQuestions(function(data){
            $(".qna").hide();
            $("#question_" + index).show();
            $(".answer_area_" + index).show();
            makeForm(data);
        }, index);
    });
});

function makeForm(data) {
    $("#idx").val(data.index);
    $("#question_" + data.index).text(data.question);
    $(".answer_area_" + data.index +" #answer_"+data.index+"_true").text(data.answers[0]["true"]);
    $(".answer_area_" + data.index +" #answer_"+data.index+"_false").text(data.answers[1]["false"]);
}

function hideAnimate(){
    $("#mainMenu").hide();
    $("#MainWindow").hide();
}

function getQuestions(callback, index) {
    $.getJSON('./qna.json', function(data){
       callback(data[index]);
    })
}

function checkAnswer(flag){
    var _user_answer = flag; 
    var _index = $("#idx").val();
    getQuestions(function(data){
        if (_index == 1) {
            if (_user_answer == true) {
                batting = true;
            } else {
                batting = false;
            }
            $("#nextGame").click();
            return;
        }

        if (data.answer == _user_answer)  { // 정답일 경우
            if (batting) {
                mileage += (100 * 2);
                batting = false;
            } else {
                mileage += 100;
                batting = false;
            }
            $("#mileage").text(mileage);
            $("#nextGame").click();
        } else {        // 틀렸을 경우
            $("#Main").addClass("disableDiv");
            $("#wrong").show();
        }
    }, _index);
}
