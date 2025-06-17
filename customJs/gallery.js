var selectedMarker = ''

let names = {
  escasez: 'Escasez Punk Rock',
  dw: 'Detective Wadd',
  procesx: 'Procesx Punk Medallo',
  sotano: 'El Sótano Fanzine',
  agente: 'Agente Extraño',
  coprofagia: 'Coprofagia',
  fango: 'Fango',
  fanzineroso: 'Fanzineroso',
  proxtatikoz: 'Proxtatikoz',
  som: 'Solución o Muerte TPHC',
  mayoria: 'Mayoría Equivocada',
  desquiciadamente: 'Desquiciada-Mente',
  anarvista: 'AnARvista',
  av: 'AnARvista',
  med: 'Mentes en Disturbio',
  caminata: 'Caminatas Punk',
  odio: 'O.D.I.O.',
  perrera: 'La Perrera',
  nacionCriminal: 'Nación Criminal',
  katalexia: 'Katalexia',
  falp: 'X Feria Anarquista del Libro y La Publicación',
  ldm: 'Los de Menos',
  vinilos: 'Vinilos & Bebidas 77',
  comuneros: 'Colectivo Los Comuneros',
  ultrazonido: 'Ultrazonido',
  tz: 'Tukuca Zakayama',
  sietebalazos: '7 Balazos',
  ppj: 'Los PPJ',
  punkalparke: 'Festival Punk Al Parke',
  rdc: 'Ratas de Ciudad',
  fechoria: 'Fechoría Street Punk',
  reciclaje: 'Reciclaje',
  ppd: 'Presos Por Detenidos',
  carajitosgrandes: 'Carajitos Grandes',
  fechoriaBastards: "Fechoría's Bastards"
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
