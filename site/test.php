<html>
<body>
<audio controls="controls" id="player" controls autoplay><source src="http://www.tv-radio.com/station/france_inter_mp3/france_inter_mp3-128k.m3u"  type="audio/mp3"  preload="auto"  /></audio>
<!-- <<audio controls="controls" id="butter-media-element-Media0" controls autoplay src="http://95.81.146.2/franceinter/all/franceinterhautdebit.mp3"></audio>
<video controls="controls" id="butter-media-element-Media0" controls autoplay src="http://95.81.146.2/franceinter/all/franceinterhautdebit.mp3"></video>
<video id="player2" controls autoplay src="http://stream.wbai.org/64kmono.m3u"></video>-->
<audio id="player" controls autoplay src="http://stream.wbai.org/64kmono.m3u"></audio>
<audio id="player2" controls autoplay src="http://www.tv-radio.com/station/france_inter_mp3/france_inter_mp3-128k.m3u"></audio>

<div>
	<button onclick="document.getElementById('player').play()">Play</button>
	<button onclick="document.getElementById('player').pause()">Pause</button>
	<button onclick="document.getElementById('player').volume+=0.1">Volume Up</button>
	<button onclick="document.getElementById('player').volume-=0.1">Volume Down</button>
</div>

</body></html>