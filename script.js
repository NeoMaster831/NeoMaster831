
// Classes
var bulb = document.getElementById('bulb');
var line = document.getElementById('line');
var floor = document.getElementById('floor');
var omori = document.getElementById('omori');
var fancy_logo_line = document.getElementById('fancy-logo-line');
var wane = document.getElementById('wane');

// Black Space
var floor_bs = document.getElementById('floor-bs');
var door1 = document.getElementById('door1');
var door2 = document.getElementById('door2');
var door3 = document.getElementById('door3');
var door4 = document.getElementById('door4');
var door5 = document.getElementById('door5');

// Floating Texts
var discord = document.getElementById('discord');
var email = document.getElementById('email');
var click = document.getElementById('click');
var soloto = document.getElementById('soloto');
var github = document.getElementById('github');
var velog = document.getElementById('velog');
var notion = document.getElementById('notion');

// Initialize
window.addEventListener('load', function() {
    this.setTimeout(function() {
        bulb.classList.add('bulb');
        line.classList.add('line');
        floor.classList.add('floor');
        omori.classList.add('omori');
        fancy_logo_line.classList.add('fancy-logo-line');
        email.classList.add('floating-text'); email.classList.add('email');
        discord.classList.add('floating-text'); discord.classList.add('discord');
        click.classList.add('floating-text'); click.classList.add('click'); 
    }, 3500);
});

// Events
bulb.addEventListener('click', function() {
    bulb.classList.remove('bulb');
    bulb.style.opacity = '100%';
    bulb.classList.add('bulb-down');
    window.setTimeout(function() {

        document.body.style.backgroundColor = '#000000';
        floor.classList.remove('floor'); floor.style.width = '0px'; floor.style.height = '0px';
        line.classList.remove('line'); line.style.width = '0px'; line.style.height = '0px';
        bulb.style.opacity = '0%'; bulb.classList.remove('bulb');
        wane.classList.remove('wane'); wane.classList.add('wane-bs');
        fancy_logo_line.classList.remove('fancy-logo-line'); fancy_logo_line.classList.add('fancy-logo-line-bs');
        omori.classList.remove('omori'); omori.classList.add('omori-bs'); omori.style.opacity = '100%';
        floor_bs.classList.add('floor-bs');
        discord.classList.remove('discord'); discord.classList.remove('floating-text');
        email.classList.remove('email'); email.classList.remove('floating-text');
        click.classList.remove('click'); click.classList.remove('floating-text');

        soloto.classList.add('floating-text'); soloto.classList.add('soloto'); 
        github.classList.add('floating-text'); github.classList.add('github'); 
        velog.classList.add('floating-text'); velog.classList.add('velog'); 
        notion.classList.add('floating-text'); notion.classList.add('notion');
        door1.classList.add('door-bs');
        door2.classList.add('door-bs');
        door3.classList.add('door-bs');
        door4.classList.add('door-bs');
        door5.classList.add('door-bs');
        
    }, 300);
});