var selectedMarker = ''

let names = {
  escasez: 'Escasez Punk Rock',
  dw: 'Detective Wadd',
  procesx: 'Procesx Punk Medallo',
  sotano: 'El Sótano Fanzine',
  agente: 'Agente Extraño',
  coprofagia: 'Coprofagia',
  fango: 'Fango',
  proxtatikoz: 'Proxtatikoz',
  som: 'Solución o Muerte TPHC',
  mayoria: 'Mayoría Equivocada',
  desquiciadamente: 'Desquiciada-Mente',
  anarvista: 'AnARvista',
  med: 'Mentes en Disturbio',
  caminata: 'Caminatas Punk',
  odio: 'O.D.I.O.',
  perrera: 'La Perrera',
}

function clicked(tag) {
  let mN = document.getElementsByClassName('markerName')[0]
  mN.innerHTML = names[tag]
  let url = `/pages/${tag}.html`
  if (selectedMarker == tag) {
    window.location.href = url
  } else {
    selectedMarker = tag
  }
}
