if (langue_visiteur) var language = langue_visiteur;
else if (navigator.browserLanguage) var language = navigator.browserLanguage;
else var language = navigator.language;

if (language.indexOf('fr') > -1) language = "fr";
else if (language.indexOf('en') > -1) language = "en";
else if (language.indexOf('es') > -1) language = "es";
else if (language.indexOf('it') > -1) language = "it";
else language = "fr";

var traduire_avec_google = "traduire avec Google";

function switch_comments(id_me) {
	$('.yourmessage').show(); 
	
	if( $('#repondre'+id_me).is(':visible') ){ 
		$('.repondre').stop().slideUp("fast");
	} else { 
		$('.repondre').stop().slideUp("fast"); 
		$('.formulaire_poster_message').removeClass('focus');  
		$('#yourmessage'+id_me).hide(); 
		$('#repondre'+id_me).stop().slideDown("fast").find('.formulaire_poster_message').addClass('focus').find('textarea').focus();
	}  
}

	
	function favoris_actifs() {
	
		if (auteur_connecte > 0) {
			$(".texte_message, .texte_reponse").each(function() {
				
				var rel = $(this).find(".favori").children("a.activer_favori").attr("rel");
				var reg = 	new RegExp(rel, "gi");
				if (auteur_connecte.match(reg)) {
					$(this).find(".favori a.activer_favori").addClass("actif");
				} else {
					if ($(this).find(".favori .survol").length > 0) {
						$(this).find(".favori a.activer_favori").addClass("abonnes");
					} else {
						$(this).find(".favori a.activer_favori").addClass("inactif");
					}
				}
			});	
		} else {
			$(".favori").css("display", "none");
		}
	}
	
	$.fn.afficher_masques = function() {
		$(this).parents('ul.reponses').children('.masquer').each(function(){
			$(this).fadeIn();
		}); 
		$(this).slideUp(function(){
			$(this).remove();
		});
	}
	
	$.fn.suivreEdition = function () {
		area = this;
			var texte_message = area.val();
			
			var people = "<div class='titre_people'>Auteurs:</div>";
			var p = texte_message.match(reg_people);
			
			if (p) {
				for(i=0; i<p.length; ++i) {
					personne = p[i];
					nom = personne.substr(1,1000);
					lien = "people/"+nom;
					people = people +  "<span class='nom'><span class='diese'>@</span><a href=\""+lien+"\" class='spip_out'>"+nom+"</a></span>";
				}
				area.parent("div").parent("form").children(".people").html(people);
				area.parent("div").parent("form").children(".people").slideDown();
		
			} else {
				area.parent("div").parent("form").find(".people").slideUp();			
			}
			
			
			var tags = "<div class='titre_tags'>Thèmes:</div>";
			var m = texte_message.match(reghash);
			
			
			if (m) {
				for(i=0; i<m.length; ++i) {
					tag = m[i].toLowerCase();
					lien = tag.substr(1,1000);
					var affclass = "";
					
					tags = tags +  "<span class='hashtag" + affclass + "'><span class='diese'>#</span><a href=\"tags/"+lien+"\" class='spip_out'>"+lien+"</a></span>";
				}
				area.parent("div").parent("form").find(".tags").html(tags);
				area.parent("div").parent("form").find(".tags").slideDown();
			} else {
				area.parent("div").parent("form").find(".tags").slideUp();
			}
			
			
			
			var liens = "<div class='titre_links'>Liens:</div>";
			var u = texte_message.match(url_match);
			if (u) {
				for(i=0; i < u.length; ++i) {
					var lien = u[i];
					var lien_aff = lien.replace(racine_url_match, "<span>$1</span>");
					var lien_aff = lien_aff.replace(fin_url_match, "<span>$1</span>");
					
					liens = liens +  "<div class='lien'>⇧<a href=\""+lien+"\" class='spip_out'>"+lien_aff+"</a></div>";
				}
				area.parent("div").parent("form").find(".liens").html(liens);
				area.parent("div").parent("form").find(".liens").slideDown();
			} else {
				area.parent("div").parent("form").find(".liens").slideUp();
			}
	
	}

	function afficher_traduire() {
		$("blockquote").each(function() {
			var me = $(this);
			me.find(".traduire").remove();
			var langue = me.attr("lang");
			if (langue!="" && langue != language) {
				var contenu = encodeURIComponent(me.html());
				me.append("<div class='traduire'><a href='#'>"+traduire_avec_google+"</a></div>");
				me.find(".traduire").bind("click", function() {
					me.attr("lang", "").find(".traduire").remove();
						me.html("<div class='loading_icone'><img src='squelettes/imgs/loading.gif' alt='chargement' /></div>");
						$.post("index.php?page=translate", { contenu: contenu+" ", dest: language, source: langue }, function (data) {
						me.html(data);
					});
					return false;
				});
			}
		});
	}

	
	$(document).ready(function(){

		$.ajaxSetup({ cache: true });
		if (langue_visiteur && langue_visiteur != "fr") {
				$.getScript("index.php?page=js.calcul_date&lang="+langue_visiteur)
		}
		if (langue_visiteur) {
			$.getScript("index.php?page=js.textes_interface&lang="+langue_visiteur)
		}
		else {
			var lang_id = "";
			if ($.cookie('lang_id')) lang_id = $.cookie('lang_id');
			else {
				lang_id = Math.floor(Math.random() * 1000000);
				$.cookie('lang_id', lang_id, { expires: 1 });
			}
		
			$.getScript("index.php?page=js.textes_interface&lang_id="+lang_id)
			
		}


		var time_alert = $.timeout ( function () {
				$("#alertes").load("index.php?page=alertes", function() {
					$("#alertes").slideDown();
				});
			}, 500);
				

		if (auteur_connecte > 0) {
			$(".bouton_repondre a").live("click", function() {
				id = $(this).attr("rel");
				switch_comments(id);
				return false;
			});
			if (window.auteur_page !== undefined) {
				if (auteur_connecte != auteur_page) {
					$("body.people .messager").show();
				}
			}
		} else {
			$(".bouton_repondre a").hide();
			$("body.message .page_auteur").show();
		}
		
		

		if ($("body").hasClass("people") &&  auteur_connecte > 0 && auteur_connecte != auteur_page) {
			$("#follow").load('index.php?action=bouton_follow_people&id_auteur='+auteur_page);
		}

		if ($("body").hasClass("mot") &&  auteur_connecte > 0) {
			$("#follow_mot").load('index.php?action=bouton_follow_mot&id_mot='+id_mot);
		}

		favoris_actifs();
		afficher_traduire();
		
		$("ul#scroll_tags").liScroll();
		
		$("a.spip_out").live("click", function() {
			window.open($(this).attr("href"));
			return false;
		});
	
		//$('textarea').autoResize();



		$('textarea').live("keydown", function(e) {
			var area = $(this);
			var keyCode = e.keyCode || window.event.keyCode;

			// shift + enter (valider)
			if (keyCode == 13 && isCtrl) {
				isCtrl = false;
				area.submit();
				return false;
			}
			// shift + tab (citer)
			if (keyCode == 9 && isCtrl) {
				isCtrl = false;
				$(this).replaceSelection("\n❝" + $(this).getSelection().text + "❞\n", true);
				return false;
			}

			// detecter le shift
			if (keyCode == 16) {
				isCtrl = true;
			} else {
				isCtrl = false;
			}
		});
		
		$('textarea').live("keyup", function(e) {
			var area = $(this);
			$.idle(function() { area.suivreEdition(); }, 1000);
		});

		$('.formulaire_poster_message  textarea').live("click", function() {
			$(".formulaire_poster_message").removeClass('focus');
			$(this).parents(".formulaire_poster_message").addClass('focus');
		});
		
		$('input[type=reset]').live("click", function() {
			$('.formulaire_poster_message').removeClass('focus');
			$(this).parents(".formulaire_poster_message").find("textarea").val("").suivreEdition();
			$('.yourmessage').show(); 
			$('.repondre').hide();
			return false;
		});
		
		$("textarea").live("focus", function() {
			$(this).removeAttr("rows").removeAttr("cols");
			$(this).elastic();
		});
		
		$(".texte_message, .texte_reponse").live("mouseenter", function() {
			
			if (auteur_connecte > 0) {
				$(this).find(".favori a.inactif").show();
			}
			
			var rel = $(this).find(".modifier").children("a").attr("rel");
			if (auteur_connecte == rel) {
				$(this).find(".modifier").children("a").show();
			}
			
			var rel = $(this).find(".supprimer").children("a").attr("rel");
			var reg = 	new RegExp(rel, "gi");
			if (auteur_connecte.match(reg)) {
				$(this).find(".supprimer").children("a").show();
			}

		});
		$(".texte_message, .texte_reponse").live("mouseleave", function() {
			$(this).find(".supprimer").children("a").hide();
			$(this).find(".modifier").children("a").hide();
			$(this).find(".favori a.inactif").hide();
		});
			
		afficher_oe();		
	});
	/* Activer quand on charge un element de page en Ajax 
	   pour les trucs qui ne fonctionnent pas en mode live */
	$(document).ajaxComplete(function(){
		//$('textarea').autoResize();
		favoris_actifs();
	});