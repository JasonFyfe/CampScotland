function menuCheck(){
    if(this.window.innerWidth < 510){
        this.document.getElementById("right-menu").style.display = "none";
        this.document.getElementById("toc-item").style.display = "";
    } else if( this.window.innerWidth > 510) {
        this.document.getElementById("toc-item").style.display = "none";
        this.document.getElementById("right-menu").style.display = "";
    }
}

window.addEventListener("resize", menuCheck);
window.addEventListener("DOMContentLoaded", menuCheck);