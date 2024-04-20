export function getTypeColor(type) {
    const colors = {
      normal: '#AAAA99',
      fighting: '#BB5544',
      flying: '#8899FF',
      poison: '#AA5599',
      ground: '#DDBB55',
      rock: '#BBAA66',
      bug: '#AABB22',
      ghost: '#6666BB',
      steel: '#AAAABB',
      fire: '#FF4422',
      water: '#3399FF',
      grass: '#77CC55',
      electric: '#FFCC33',
      psychic: '#FF5599',
      ice: '#66CCFF',
      dragon: '#7766EE',
      dark: '#775544',
      fairy: '#EE99EE',
    };
    return colors[type.toLowerCase()] || '#FFFFFF'; // Retorna a cor correspondente ao tipo ou branco se não houver correspondência
  }
  