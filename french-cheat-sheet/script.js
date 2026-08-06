const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalizeSpeech=s=>s.replace(/\([^)]*\)/g,'').replace(/\s+/g,' ').replace(/\s+([?.!,])/g,'$1').trim();
function speak(text){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(normalizeSpeech(text));utterance.lang='fr-FR';utterance.rate=.88;window.speechSynthesis.speak(utterance)}

document.addEventListener('click',event=>{const button=event.target.closest('.speak');if(button){const phrase=button.parentElement.querySelector('.fr');if(phrase)speak(phrase.textContent)}});

const heroExamples={
  present:{tokens:[['Je','q'],['mange','v'],['maintenant','o']],fr:'Je mange maintenant.',en:'I am eating now.',note:'Présent: what is happening now, a habit, or a general fact.'},
  passe:{tokens:[["J’",'q'],['ai mangé','v'],['hier','o']],fr:'J’ai mangé hier.',en:'I ate yesterday.',note:'Passé composé: a finished event viewed as complete.'},
  imparfait:{tokens:[['Je','q'],['mangeais','v'],['quand tu as appelé','o']],fr:'Je mangeais quand tu as appelé.',en:'I was eating when you called.',note:'Imparfait sets the ongoing scene; passé composé gives the interrupting event.'}
};
function renderHeroTense(key){const data=heroExamples[key];$('#heroTokens').innerHTML=data.tokens.map(([text,cls])=>`<span class="token ${cls}">${text}</span>`).join('');$('#heroFrench').textContent=data.fr;$('#heroEnglish').textContent=data.en;$('#heroNote').textContent=data.note;$$('#heroTenseSwitch .seg-btn').forEach(btn=>{const active=btn.dataset.demo===key;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))})}
renderHeroTense('present');$('#heroTenseSwitch').addEventListener('click',event=>{const btn=event.target.closest('[data-demo]');if(btn)renderHeroTense(btn.dataset.demo)});

const phraseCards=$$('.card[data-tense]');
function applyCardFilters(){const query=$('#search').value.toLocaleLowerCase().trim();const filter=$('#tenseFilter').value;let visible=0;phraseCards.forEach(card=>{const tenses=(card.dataset.tense||'').split(/\s+/);const tenseMatch=filter==='all'||tenses.includes('both')||tenses.includes(filter)||(filter==='past'&&(tenses.includes('passe')||tenses.includes('imparfait')));const searchMatch=!query||card.textContent.toLocaleLowerCase().includes(query);const show=tenseMatch&&searchMatch;card.classList.toggle('hidden',!show);if(show)visible++});$('#empty').classList.toggle('hidden',visible>0||(!query&&filter==='all'))}
$('#search').addEventListener('input',applyCardFilters);$('#tenseFilter').addEventListener('change',applyCardFilters);

const themeButton=$('#themeToggle');
let savedTheme=null;try{savedTheme=localStorage.getItem('french-cheat-theme')}catch(error){}if(savedTheme)document.documentElement.dataset.theme=savedTheme;
function updateThemeLabel(){const dark=document.documentElement.dataset.theme==='dark';themeButton.textContent=dark?'☀':'◐';themeButton.setAttribute('aria-label',dark?'Use light mode':'Use dark mode');document.querySelector('meta[name="theme-color"]').setAttribute('content',dark?'#0f1714':'#176b5b')}
updateThemeLabel();themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('french-cheat-theme',next)}catch(error){}updateThemeLabel()});

const tablePronouns=['je','tu','il / elle / on','nous','vous','ils / elles'];
const verbTables={
  present:{
    etre:['suis','es','est','sommes','êtes','sont'],avoir:['ai','as','a','avons','avez','ont'],aller:['vais','vas','va','allons','allez','vont'],venir:['viens','viens','vient','venons','venez','viennent'],pouvoir:['peux','peux','peut','pouvons','pouvez','peuvent'],vouloir:['veux','veux','veut','voulons','voulez','veulent'],devoir:['dois','dois','doit','devons','devez','doivent'],faire:['fais','fais','fait','faisons','faites','font']
  },
  passe:{
    etre:['ai été','as été','a été','avons été','avez été','ont été'],avoir:['ai eu','as eu','a eu','avons eu','avez eu','ont eu'],aller:['suis allé(e)','es allé(e)','est allé(e)','sommes allé(e)s','êtes allé(e)(s)','sont allé(e)s'],venir:['suis venu(e)','es venu(e)','est venu(e)','sommes venu(e)s','êtes venu(e)(s)','sont venu(e)s'],pouvoir:['ai pu','as pu','a pu','avons pu','avez pu','ont pu'],vouloir:['ai voulu','as voulu','a voulu','avons voulu','avez voulu','ont voulu'],devoir:['ai dû','as dû','a dû','avons dû','avez dû','ont dû'],faire:['ai fait','as fait','a fait','avons fait','avez fait','ont fait']
  },
  imparfait:{
    etre:['étais','étais','était','étions','étiez','étaient'],avoir:['avais','avais','avait','avions','aviez','avaient'],aller:['allais','allais','allait','allions','alliez','allaient'],venir:['venais','venais','venait','venions','veniez','venaient'],pouvoir:['pouvais','pouvais','pouvait','pouvions','pouviez','pouvaient'],vouloir:['voulais','voulais','voulait','voulions','vouliez','voulaient'],devoir:['devais','devais','devait','devions','deviez','devaient'],faire:['faisais','faisais','faisait','faisions','faisiez','faisaient']
  }
};
const verbTableNotes={present:'<b>Présent:</b> use these forms for what is happening now, habits, facts, and sometimes a scheduled or near future with a time word.',passe:'<b>Passé composé:</b> être and avoir themselves use avoir here: <i>j’ai été</i>, <i>j’ai eu</i>. Aller and venir use être and therefore show agreement.',imparfait:'<b>Imparfait:</b> notice the repeating endings: -ais, -ais, -ait, -ions, -iez, -aient. The pronunciation of four of the six endings is often the same.'};
function renderVerbTable(tense){const keys=['etre','avoir','aller','venir','pouvoir','vouloir','devoir','faire'];$('#verbTable tbody').innerHTML=tablePronouns.map((pronoun,row)=>`<tr><td><strong>${pronoun}</strong></td>${keys.map(key=>`<td>${verbTables[tense][key][row]}</td>`).join('')}</tr>`).join('');$('#verbTableNote').innerHTML=verbTableNotes[tense];$$('#verbTenseSwitch [data-verb-tense]').forEach(btn=>{const active=btn.dataset.verbTense===tense;btn.classList.toggle('primary',active);btn.setAttribute('aria-pressed',String(active))})}
renderVerbTable('present');$('#verbTenseSwitch').addEventListener('click',event=>{const btn=event.target.closest('[data-verb-tense]');if(btn)renderVerbTable(btn.dataset.verbTense)});

const subjectInfo={
  je:{label:'Je',question:'je',group:'singular'},tu:{label:'Tu',question:'tu',group:'singular'},il:{label:'Il',question:'il',group:'singular'},elle:{label:'Elle',question:'elle',group:'singular'},on:{label:'On',question:'on',group:'singular'},nous:{label:'Nous',question:'nous',group:'plural'},vous:{label:'Vous',question:'vous',group:'plural'},ils:{label:'Ils',question:'ils',group:'plural'},elles:{label:'Elles',question:'elles',group:'plural'}
};
const avoirAux={je:'ai',tu:'as',il:'a',elle:'a',on:'a',nous:'avons',vous:'avez',ils:'ont',elles:'ont'};
const etreAux={je:'suis',tu:'es',il:'est',elle:'est',on:'est',nous:'sommes',vous:'êtes',ils:'sont',elles:'sont'};
function startsWithVowel(text){return /^[aeiouyàâäéèêëîïôöùûüh]/i.test(text)}
function agreeParticiple(pp,subject){if(subject==='il')return pp;if(subject==='elle')return pp+'e';if(subject==='ils')return pp+'s';if(subject==='elles')return pp+'es';if(subject==='nous')return pp+'(e)s';if(subject==='vous')return pp+'(e)(s)';if(subject==='on')return pp+'(e)(s)';return pp+'(e)'}
function statementPrefix(subject,finite){if(subject==='je'&&startsWithVowel(finite))return 'J’';return subjectInfo[subject].label+' '}
function questionPrefix(subject,finite){if(subject==='je')return startsWithVowel(finite)?'Est-ce que j’':'Est-ce que je ';if(['il','elle','on','ils','elles'].includes(subject))return 'Est-ce qu’'+subjectInfo[subject].question+' ';return 'Est-ce que '+subjectInfo[subject].question+' '}
function negativePrefix(subject,finite){const label=subjectInfo[subject].label;return label+(startsWithVowel(finite)?' n’':' ne ')+finite+' pas'}
function getFiniteAndRest(subject,tense,idea){const complement=idea.complements?idea.complements[subject]:idea.complement;if(tense==='present')return{finite:idea.present[subject],rest:complement};if(tense==='imparfait')return{finite:idea.imparfait[subject],rest:complement};const aux=idea.aux==='etre'?etreAux[subject]:avoirAux[subject];const pp=idea.aux==='etre'?agreeParticiple(idea.pp,subject):idea.pp;return{finite:aux,rest:[pp,complement].filter(Boolean).join(' ')}}
const tenseLabels={present:'Présent',passe:'Passé composé',imparfait:'Imparfait'};
const tenseTips={present:'Use this for now, habits, general truths, or a scheduled action made clear by a time expression.',passe:'Use this when the action is completed or advances the story. In the negative, ne…pas surrounds the auxiliary.',imparfait:'Use this for ongoing background, repeated past habits, descriptions, age, weather, time, and feelings.'};
let builderSpeech='';
function renderBuilder(){const subject=$('#builderSubject').value,tense=$('#builderTense').value,idea=ideas[$('#builderIdea').value];const {finite,rest}=getFiniteAndRest(subject,tense,idea);const phrase=[finite,rest].filter(Boolean).join(' ');const statement=statementPrefix(subject,finite)+phrase+'.';const question=questionPrefix(subject,finite)+phrase+' ?';const negative=negativePrefix(subject,finite)+(rest?' '+rest:'')+'.';$('#builderStatement').textContent=statement;$('#builderQuestion').textContent=question;$('#builderNegative').textContent=negative;$('#builderMeaning').textContent=idea.meaning[tense];$('#builderBadge').textContent=tenseLabels[tense];$('#builderTip').innerHTML='<b>Why this tense:</b> '+tenseTips[tense]+(idea.aux==='etre'&&tense==='passe'?' This verb uses <b>être</b>, so its participle agrees with the subject.':'');builderSpeech=statement}
['#builderSubject','#builderTense','#builderIdea'].forEach(selector=>$(selector).addEventListener('change',renderBuilder));renderBuilder();$('#builderSpeak').addEventListener('click',()=>speak(builderSpeech));

const quizDeck=[
  {tense:'present',prompt:'Where is the station?',answer:'Où est la gare ?',explain:'Use où est with one place or thing.'},
  {tense:'present',prompt:'Can we leave?',answer:'Est-ce qu’on peut partir ?',explain:'On is the usual spoken form of “we.”'},
  {tense:'present',prompt:'Are you coming?',answer:'Tu viens ?',explain:'Rising intonation makes a natural spoken question.'},
  {tense:'present',prompt:'We are there.',answer:'On est là.',explain:'Natural conversational French.'},
  {tense:'present',prompt:'There is a problem.',answer:'Il y a un problème.',explain:'Il y a does not change for singular or plural.'},
  {tense:'present',prompt:'What are you doing?',answer:'Qu’est-ce que tu fais ?',explain:'The core verb is faire.'},
  {tense:'passe',prompt:'What did you do?',answer:'Qu’est-ce que tu as fait ?',explain:'Passé composé: as + fait.'},
  {tense:'passe',prompt:'I ate yesterday.',answer:'J’ai mangé hier.',explain:'A completed event uses passé composé.'},
  {tense:'passe',prompt:'She arrived.',answer:'Elle est arrivée.',explain:'Arriver uses être; arrivée agrees with elle.'},
  {tense:'passe',prompt:'They left.',answer:'Ils sont partis.',explain:'Partir uses être; partis agrees with ils.'},
  {tense:'passe',prompt:'I did not understand.',answer:'Je n’ai pas compris.',explain:'Ne…pas surrounds the auxiliary ai.'},
  {tense:'passe',prompt:'Did you see it?',answer:'Est-ce que tu l’as vu ?',explain:'The direct-object pronoun comes before as.'},
  {tense:'passe',prompt:'What happened?',answer:'Qu’est-ce qui s’est passé ?',explain:'Memorize this as one high-value question.'},
  {tense:'imparfait',prompt:'Where were you?',answer:'Tu étais où ?',explain:'A past location or state is normally background.'},
  {tense:'imparfait',prompt:'What were you doing?',answer:'Qu’est-ce que tu faisais ?',explain:'An action in progress uses imparfait.'},
  {tense:'imparfait',prompt:'We were there.',answer:'On était là.',explain:'A background state uses imparfait.'},
  {tense:'imparfait',prompt:'There were many people.',answer:'Il y avait beaucoup de monde.',explain:'This describes the scene.'},
  {tense:'imparfait',prompt:'I used to go there.',answer:'J’y allais.',explain:'A repeated past habit uses imparfait.'},
  {tense:'imparfait',prompt:'I was working when you called.',answer:'Je travaillais quand tu as appelé.',explain:'Imparfait sets the scene; passé composé interrupts it.'},
  {tense:'imparfait',prompt:'When I was little…',answer:'Quand j’étais petit(e)…',explain:'Age and background description use imparfait.'}
];
let quizIndex=0,filteredDeck=[...quizDeck];
function renderQuiz(){if(!filteredDeck.length)return;quizIndex%=filteredDeck.length;const card=filteredDeck[quizIndex];$('#quizTag').textContent=tenseLabels[card.tense];$('#quizPrompt').textContent=card.prompt;$('#quizAnswer').textContent=card.answer;$('#quizExplain').textContent=card.explain;$('#quizAnswer').classList.add('hidden');$('#quizExplain').classList.add('hidden');$('#quizCounter').textContent=`${quizIndex+1} / ${filteredDeck.length}`}
function updateQuizFilter(){const filter=$('#quizFilter').value;filteredDeck=filter==='all'?[...quizDeck]:quizDeck.filter(card=>card.tense===filter);quizIndex=0;renderQuiz()}
$('#quizFilter').addEventListener('change',updateQuizFilter);$('#reveal').addEventListener('click',()=>{$('#quizAnswer').classList.remove('hidden');$('#quizExplain').classList.remove('hidden')});$('#next').addEventListener('click',()=>{quizIndex=(quizIndex+1)%filteredDeck.length;renderQuiz()});$('#quizSpeak').addEventListener('click',()=>speak(filteredDeck[quizIndex].answer));$('#quizOpen').addEventListener('click',()=>$('#quiz').scrollIntoView({behavior:'smooth'}));renderQuiz();

function updateScrollProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;$('#scrollProgress').style.width=(max>0?(window.scrollY/max)*100:0)+'%'}
window.addEventListener('scroll',updateScrollProgress,{passive:true});window.addEventListener('resize',updateScrollProgress);updateScrollProgress();
