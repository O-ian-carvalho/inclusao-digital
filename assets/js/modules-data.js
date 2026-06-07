// modules-data.js - shared module definitions
window.COURSE = {
  id: 'curso-windows-1',
  title: 'Uso Básico do Windows',
  shortDescription: 'Aprenda operações básicas do Windows para melhorar inclusão digital e acessibilidade.',
}

window.MODULES = [
  {
    id: 1,
    number: 1,
    title: 'Tela Inicial do Windows',
    short: 'Área de trabalho, Menu Iniciar, Barra de tarefas',
    icon: 'bi-display',
    full: `A área de trabalho é o primeiro elemento que aparece após ligar o computador e fazer login no Windows. É nela que você encontra os ícones dos programas, a Barra de Tarefas (localizada geralmente na parte inferior da tela), o Menu Iniciar e a área de notificações.

O Menu Iniciar é o ponto central para acessar programas, configurações e arquivos. Basta clicar no botão do Windows no canto inferior esquerdo para abri-lo. Nele você pode digitar o nome de um programa para encontrá-lo rapidamente.

A Barra de Tarefas exibe os programas que estão abertos e permite alternar entre eles com um clique. Você também pode fixar seus programas favoritos para acessá-los sem precisar procurar no Menu Iniciar.

Para abrir um programa, clique no botão do Menu Iniciar, encontre o programa desejado e clique sobre ele. Para fechá-lo, clique no "X" no canto superior direito da janela do programa.`,
    videos: [
      { title: 'Usando o Menu Iniciar, Barra de Tarefas e abrindo/fechando programas', url: '' }
    ]
  },
  {
    id: 2,
    number: 2,
    title: 'Visualização Acessível',
    short: 'Tamanho de ícones e textos, escala e brilho',
    icon: 'bi-eye',
    full: `O Windows permite personalizar a aparência da tela para tornar o uso mais confortável, especialmente para pessoas com baixa visão ou dificuldade de leitura.

Você pode aumentar ou diminuir o tamanho dos ícones da área de trabalho: clique com o botão direito sobre a área de trabalho, vá em "Exibir" e escolha entre Ícones grandes, médios ou pequenos.

Para aumentar textos e aplicativos inteiros, vá em Configurações > Sistema > Tela e ajuste a "Escala". O recomendado geralmente é 100% ou 125%, mas você pode testar valores maiores para enxergar melhor.

A resolução da tela controla a nitidez das imagens. Em Configurações > Sistema > Tela, escolha a resolução recomendada pelo sistema (marcada como "Recomendado").

O brilho da tela pode ser ajustado para evitar cansaço visual. Em notebooks, use as teclas de função (como F5 e F6) ou vá em Configurações > Sistema > Tela e use o controle deslizante de brilho.`,
    videos: [
      { title: 'Ajustando ícones, textos, escala, resolução e brilho', url: '' }
    ]
  },
  {
    id: 3,
    number: 3,
    title: 'Recursos de Acessibilidade',
    short: 'Narrador, teclado virtual, digitação por voz, mouse',
    icon: 'bi-people',
    full: `O Windows oferece diversas ferramentas de acessibilidade que tornam o computador mais fácil de usar para pessoas com diferentes necessidades.

O Narrador é um leitor de tela integrado que descreve em voz alta o que está na tela: textos, botões, menus e notificações. Para ativá-lo, pressione Tecla Windows + Ctrl + Enter ou vá em Configurações > Acessibilidade > Narrador.

O Teclado Virtual (ou Teclado de Toque) permite digitar usando o mouse ou a tela de toque. Útil se o teclado físico estiver com defeito ou se você tiver dificuldades motoras. Ative-o em Configurações > Acessibilidade > Teclado > Ativar Teclado Virtual.

A Digitação por Voz permite escrever textos falando. Pressione Tecla Windows + H para abrir o reconhecimento de fala. Fale pausadamente e o Windows converterá sua fala em texto.

Além disso, você pode personalizar o ponteiro do mouse para facilitar a visualização: vá em Configurações > Acessibilidade > Tamanho do ponteiro do mouse e ajuste o tamanho e a cor. Escolha entre branco, preto ou cores invertidas para melhor contraste.`,
    videos: [
      { title: 'Habilitando Narrador, Digitação por Voz e Teclado Virtual', url: '' },
      { title: 'Personalizando o ponteiro do mouse (tamanho e cor)', url: '' }
    ]
  },
  {
    id: 4,
    number: 4,
    title: 'Configurações Básicas',
    short: 'Volume, idioma, papel de parede, Bluetooth',
    icon: 'bi-gear',
    full: `Saber ajustar as configurações básicas do Windows ajuda a deixar o computador do seu jeito.

Para aumentar ou diminuir o volume do áudio, clique no ícone de alto-falante ao lado do relógio na Barra de Tarefas e arraste o controle deslizante. Você também pode usar as teclas de função do teclado.

Para alterar o idioma do sistema, vá em Configurações > Hora e Idioma > Idioma e Região. Clique em "Adicionar um idioma", escolha o desejado e defina como padrão.

Para trocar o papel de parede, clique com o botão direito na área de trabalho e escolha "Personalizar". Selecione uma imagem ou cor sólida. Você também pode usar uma apresentação de slides com várias fotos.

O Windows também gerencia dispositivos conectados. Vá em Configurações > Bluetooth e dispositivos para ver o que está conectado (mouse, teclado, fone de ouvido). Para conectar um novo dispositivo Bluetooth, ative o Bluetooth, clique em "Adicionar dispositivo" e siga as instruções.`,
    videos: [
      { title: 'Ajustando volume, idioma e papel de parede', url: '' },
      { title: 'Gerenciando dispositivos e conectando Bluetooth', url: '' }
    ]
  },
  {
    id: 5,
    number: 5,
    title: 'Organização de Arquivos',
    short: 'Explorador, copiar, colar, excluir, criar pastas',
    icon: 'bi-folder',
    full: `Manter os arquivos organizados é essencial para encontrar rapidamente o que você precisa e evitar perda de dados.

O Explorador de Arquivos é a ferramenta do Windows para navegar pelas pastas e arquivos do computador. Abra-o clicando no ícone de pasta na Barra de Tarefas ou pressionando Tecla Windows + E.

Para criar uma nova pasta, navegue até o local desejado, clique com o botão direito em um espaço vazio, vá em "Novo" > "Pasta" e dê um nome a ela.

Para copiar um arquivo ou pasta, clique com o botão direito sobre ele e escolha "Copiar" (ou pressione Ctrl + C). Navegue até o destino, clique com o botão direito em um espaço vazio e escolha "Colar" (ou pressione Ctrl + V).

Para recortar (mover) um arquivo, use "Recortar" (Ctrl + X) em vez de Copiar. Para renomear, clique com o botão direito e escolha "Renomear". Para excluir, clique com o botão direito e escolha "Excluir" (ou pressione a tecla Delete). Os arquivos excluídos vão para a Lixeira e podem ser recuperados se necessário.`,
    videos: [
      { title: 'Usando o Explorador, renomeando, copiando, recortando, colando e criando pastas', url: '' }
    ]
  }
]
