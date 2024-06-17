function start() {
	//Area Divs
	$('#start').hide();
	$('#gameover').hide();
	$('#vitoria').hide();
	$('#area_jogo').append("<div id='tardis' class='tardis'></div>");
	$('#area_jogo').append("<div id='leader' class='leader'></div>");
	$('#area_jogo').append("<div id='supreme' class='supreme'></div>");
	$('#area_jogo').append("<div id='k9' class='k9'></div>");
	$('#area_jogo').append("<div id='vida_tardis' class='vida'></div>");
	$('#area_jogo').append("<div id='pontuacao' class='pontos'>Pontos: </div>");
	
	//Variaveis globais
	var tardis_local = 0;
	var tecla = {
		C:38,
		B:40,
		E:37,
		D:39,
		T:32
	}
	var jogo = {}
	jogo.pressionou = [];
	var vida = 4;
	var pontos = 0;
	var countTiro = 0;
	var ultimoTiro = 0;
	var tempoEntreTiros = 300;
	var invencivel = false;
	var tardis_morta = false;
	var k9_morto = false;
	var ultimoMultiploVerificado = 0;
	var velocidade = 1;

	nasce_leader();
    nasce_supreme();
    nasce_k9();
    
	
	//Teclas pressionadas
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
	});


	$(document).keyup(function(e){
	   jogo.pressionou[e.which] = false;
	});	

	//Sons
	var somjogo=document.getElementById("somjogo");		
	var laserleader=document.getElementById("laserleader");		
	var lasersupreme=document.getElementById("lasersupreme");	
	var tirotardis=document.getElementById("tirotardis");		
	var salva=document.getElementById("salva");		
	var explode=document.getElementById("explode");		
	var explodetardis=document.getElementById("explodetardis");		
	var grito=document.getElementById("grito");		
	
	//Motor do jogo
	setInterval(loop,30);

	function loop() {
		somjogo.addEventListener("ended", function(){ somjogo.currentTime = 0; somjogo.play(); }, false);
		somjogo.play();
		movimentacenario();
		movimentatardis();
		movimentaleader();
		movimentasupreme();
		verificaPontuacao();
		movimentak9();
		movimenta_leadertiro();
		movimenta_supremetiro();
		movetiro();
		mostrapontos();
		colisao();
	}
	
	function movimentacenario() {
		var posicao = parseInt($('.area_jogo').css("background-position"));
		$('.area_jogo').css("background-position",posicao-1);
	} //Fim movimentacenario

	function movimentatardis() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		if(jogo.pressionou[tecla.C]){
			var topo = parseInt($('#tardis').css("top"));
			$('#tardis').css("top", topo-8);
			if(topo<=10)
				$('#tardis').css("top", 10);
		}

		if(jogo.pressionou[tecla.B]){
			var down = parseInt($('#tardis').css("top"));
			$('#tardis').css("top", down+10);
			if(down>=380)
				$('#tardis').css("top", 380);
		}

		if(jogo.pressionou[tecla.D]){
			var left = parseInt($('#tardis').css("left"));
			$('#tardis').css("left", left+10);
			if(left>=750)
				$('#tardis').css("left", 750);
		}

		if(jogo.pressionou[tecla.E]){
			var left = parseInt($('#tardis').css("left"));
			$('#tardis').css("left", left-10);
			if(left<=0)
				$('#tardis').css("left", 0);
		}
		
		if (jogo.pressionou[tecla.T]) {
			var now = performance.now();
			if (now - ultimoTiro > tempoEntreTiros) {
				ultimoTiro = now;
				if ($('#tiro').length == 0) {
					if (tardis_morta == true){
						return;
					}
					tirotardis.play();
					countTiro++;
					var pos_y = parseFloat($('#tardis').css("top"));
					var pos_x = parseFloat($('#tardis').css("left"));
					var newDivId = 'tiro' + countTiro;
					console.log('tiro' + countTiro);
					$('#area_jogo').append("<div id='" + newDivId + "' class='tiro'></div>");
					$('#' + newDivId).css("left", pos_x + 20);
					$('#' + newDivId).css("top", pos_y + 30);
				}
			} 
		}
	} //Movimenta tardis

	function verificaPontuacao() {
		if (pontos >= ultimoMultiploVerificado + 1000) {
			velocidade += 1;
			ultimoMultiploVerificado += 1000;
		}
		
		if (pontos >= 10000) {
			mostrarTelaDeVitoria();
		}
	}

	function movimentaleader() {
		var left = parseInt($('#leader').css("left"));
    	$('#leader').css("left", left - (5 + velocidade));
		if(left<=-10) {
			nasce_leader();
		}
		
		if((left<=810) && (left>=800) && ($('#leader_tiro').length==0)){
			tardis_local = parseInt($('#tardis').css('top'));

			var topo = parseInt($('#leader').css("top"));
			$('#area_jogo').append("<div id='leader_tiro' class='tiro_leader'></div>");		
			$('.tiro_leader').css("top", topo);			
		}
		
	} //movimenta leader
	
	function nasce_leader() {
		var local = parseInt(Math.random() * 350);
		$('#leader').css("top", local);
		$('#leader').css("left", 800);
	}
	
	function movimenta_leadertiro() {
		if($('#leader_tiro').length>0) {
			if($('#leader_tiro').data('sound') !== true) {
				laserleader.play();
				$('#leader_tiro').data('sound', true);
			}
			var left = parseInt($('#leader_tiro').css("left"));
			$('#leader_tiro').css("left", left - (10 + velocidade));
			
			if(left <=0) {
				$('#leader_tiro').remove();
			}
		}
	}
	
	function movimenta_supremetiro() {
		if ($('#supreme_tiro').length > 0) {
			if($('#supreme_tiro').data('sound') !== true) {
				lasersupreme.play();
				$('#supreme_tiro').data('sound', true);
			}
			var left = parseInt($('#supreme_tiro').css("left"));
			$('#supreme_tiro').css("left", left - (5 + velocidade));
			
			if(left <=0) {
				$('#supreme_tiro').remove();
			}
		}
	}

	function movimentasupreme() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		var left = parseInt($('#supreme').css("left"));
    	$('#supreme').css("left", left - (3 + velocidade));
		if(left<=-10) {
			nasce_supreme();
		}
		
		if((left<=810) && (left>=800) && ($('#supreme_tiro').length==0)){
			tardis_local = parseInt($('#tardis').css('top'));

			var topo = parseInt($('#supreme').css("top"));
			$('#area_jogo').append("<div id='supreme_tiro' class='tiro_supreme'></div>");		
			$('.tiro_supreme').css("top", topo);			
		}
		
	} //movimenta supreme
	
	function nasce_supreme() {
		var local = parseInt(Math.random() * 350);
		$('#supreme').css("top", local);
		$('#supreme').css("left", 800);
	}
	
	function movetiro() {
		$('.tiro').each(function () {
			var tiro = $(this);
			var left = parseInt(tiro.css("left"));
			tiro.css("left", left + 20);
			if (left >= 810 || left <= 0) {
				tiro.remove();
			}
		});
	}
	
	
	function movimentak9() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		var left = parseInt($('#k9').css("left"));
		$('#k9').css("left", left + 5);
		if (left >= 640) {
			nasce_k9();
		}
	}
	
	function nasce_k9() {
		if (k9_morto == true){
			return;
		}
		var local = Math.random() * 250;
		$('#k9').css("top", local);
		$('#k9').css("left", -30);
	}
	
	function colisao() {

		$('.tiro').each(function () {
			var tiro = $(this);
			var colisaoTiroLeader = tiro.collision($("#leader"));
			if (colisaoTiroLeader.length > 0) {
				explode.play();
				var posicaoX = $('#leader').css("left");
				var posicaoY = $('#leader').css("top");
				tiro.remove();
				$('#leader').remove();
				$('#area_jogo').append("<div id='leader_exp' class='leader_explode'></div>");
				$('#leader_exp').css('top', posicaoY);
				$('#leader_exp').css('left', posicaoX);
				setTimeout(function () {
					$('#area_jogo').append("<div id='leader' class='leader'></div>");
					$('#leader_exp').remove();
					nasce_leader(); 
				}, 400);
				pontos = pontos + 100;
			}
		});
		
		// Verifica colisão entre cada tiro e o supremo
		$('.tiro').each(function () {
			var tiro = $(this);
			var colisaoTiroSupreme = tiro.collision($("#supreme"));
			if (colisaoTiroSupreme.length > 0) {
				explode.play();
				var posicaoX = $('#supreme').css("left");
				var posicaoY = $('#supreme').css("top");
				tiro.remove();
				$('#supreme').remove();
				$('#area_jogo').append("<div id='supreme_exp' class='supreme_explode'></div>");
				$('#supreme_exp').css('top', posicaoY);
				$('#supreme_exp').css('left', posicaoX);
				setTimeout(function () {
					$('#area_jogo').append("<div id='supreme' class='supreme'></div>");
					$('#supreme_exp').remove();
					nasce_supreme();
				}, 400);
				pontos = pontos + 100;
			}
		});

		var colisao_tardis_k9 =  ($("#tardis").collision($("#k9")));
		var colisao_leader_tiro_k9 =  ($("#leader_tiro").collision($("#k9")));
		var colisao_supreme_tiro_k9 =  ($("#supreme_tiro").collision($("#k9")));
		var colisaoTardisLeader = $("#tardis").collision($("#leader"));
        var colisaoTardisSupreme = $("#tardis").collision($("#supreme"));
        var colisaoTardisLeaderTiro = $("#tardis").collision($("#leader_tiro"));
        var colisaoTardisSupremeTiro = $("#tardis").collision($("#supreme_tiro"));
	
		if(colisao_tardis_k9.length > 0) {
			k9_morto = true;
			salva.play();
			$('#k9').remove();
			setTimeout(function() {
				k9_morto = false;
				$('#area_jogo').append("<div id='k9' class='k9'></div>");
				nasce_k9();
			},2000);
			pontos = pontos + 200;
		}
	
		if(colisao_leader_tiro_k9.length > 0) {
			k9_morto = true;
			grito.play();
			$('#k9').remove();
			$('#leader_tiro').remove();
			setTimeout(function(){
				k9_morto = false;
				$('#area_jogo').append("<div id='k9' class='k9'></div>");
				nasce_k9();
			},5000);
			pontos = pontos - 500;
		}
	
		if(colisao_supreme_tiro_k9.length > 0) {
			k9_morto = true;
			grito.play();
			$('#k9').remove();
			$('#supreme_tiro').remove();
			setTimeout(function(){
				k9_morto = false;
				$('#area_jogo').append("<div id='k9' class='k9'></div>");
				nasce_k9();
			},10000);
			pontos = pontos - 500;
		}

		if (invencivel) return;

		if ((colisaoTardisLeader.length > 0 || colisaoTardisSupreme.length > 0 ||
			colisaoTardisLeaderTiro.length > 0 || colisaoTardisSupremeTiro.length > 0) && !invencivel) {
			tardis_morta = true;
			explodetardis.play();
			removevida();
			if (vida == 0) {
				$('#tardis').remove();
				return;
			}
			var posicao_x = $('#tardis').css("left");
			var posicao_y = $('#tardis').css("top");
			$('#tardis').remove();
			$('#area_jogo').append("<div id='tardis_exp' class='tardis_explode'></div>");
			$('#tardis_exp').css('top', posicao_y);
			$('#tardis_exp').css('left', posicao_x);
			setTimeout(function() {
				$('#tardis_exp').remove();
				$('#area_jogo').append("<div id='tardis' class='tardis invencivel'></div>");
				invencivel = true;
				tardis_morta = false;
				setTimeout(function() {
					invencivel = false;
					$('#tardis').removeClass('invencivel');
				}, 3000);
			}, 1000);
			pontos -= 100;
		}
		
	}
	
	function mostrapontos() {
		$('#pontuacao').text("Pontos: " + pontos);
	}
	
	function removevida() {
		switch(vida) {
			case 4: {
				$('#vida_tardis').css("background-position","-114px 30px");
				vida--;
				break;
			}
			case 3:{
				$('#vida_tardis').css("background-position","-228px 30px");
				vida--;
				break;
			}
			case 2:{
				$('#vida_tardis').css("background-position","-342px 30px");
				vida--;
				break;
			}
			default: {
				$('#tardis').remove();
				$('#tardis_exp').remove();
				$('#leader').remove();
				$('#leader_exp').remove();
				$('#leader_tiro').remove();
				$('#supreme').remove();
				$('#supreme_exp').remove();
				$('#supreme_tiro').remove();
				$('#k9').remove();
				$('#vida_tardis').remove();
				$('#gameover').show();
				return false;
			}
		}
	}

	function mostrarTelaDeVitoria() {
		$('#tardis').remove();
		$('#tardis_exp').remove();
		$('#leader').remove();
		$('#leader_exp').remove();
		$('#leader_tiro').remove();
		$('#supreme').remove();
		$('#supreme_exp').remove();
		$('#supreme_tiro').remove();
		$('#k9').remove();
		$('#vida_tardis').remove();
		$('#vitoria').show();
		$('#gameover').hide();
	}
}
function reiniciar() {
location.reload();
}