export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }

export type Platform = 'blog' | 'linkedin'

export interface Post {
  slug: string
  title: string
  excerpt: string
  linkedinVersion: string
  content: Block[]
  date: string
  readTime: number
  tags: string[]
  status: 'published' | 'draft'
  publishedOn: Platform[]
}

export const posts: Post[] = [
  {
    slug: 'o-que-acontece-ao-digitar-uma-url',
    title: 'O que acontece quando você digita uma URL e aperta Enter?',
    excerpt:
      'Um mergulho passo a passo em tudo que acontece nos bastidores entre o clique e a página carregada: DNS, TCP, TLS, HTTP e renderização.',
    linkedinVersion:
      'Você já parou pra pensar no que acontece entre digitar "google.com" e a página aparecer?\n\nEm poucos milissegundos rolam: resolução DNS, handshake TCP (3-way), negociação TLS, requisição HTTP e finalmente a renderização no navegador.\n\nEscrevi um artigo completo destrinchando cada uma dessas etapas — inclusive os detalhes que a maioria explica pela metade (como o papel do cache de DNS e a diferença entre TCP e QUIC/HTTP3).\n\nLink do artigo completo nos comentários 👇\n\n#redes #networking #dns #tcpip #estudos',
    date: '2026-09-10',
    readTime: 8,
    tags: ['DNS', 'TCP/IP', 'HTTP', 'Fundamentos'],
    status: 'published',
    publishedOn: ['blog', 'linkedin'],
    content: [
      {
        type: 'p',
        text: 'É uma das perguntas clássicas de entrevista técnica — e por um bom motivo: ela toca em praticamente toda a pilha de redes. Vamos destrinchar o caminho completo, camada por camada.',
      },
      { type: 'h2', text: '1. Resolução de nome (DNS)' },
      {
        type: 'p',
        text: 'O navegador primeiro verifica se já sabe o IP daquele domínio: cache do navegador, cache do sistema operacional e, por fim, o resolver do provedor. Se ninguém souber, começa uma busca recursiva: root servers → servidores TLD (.com) → servidor autoritativo do domínio.',
      },
      {
        type: 'code',
        lang: 'bash',
        text: '$ dig google.com +trace\n; <<>> DiG 9.18 <<>> google.com +trace\n.                       518400  IN  NS  a.root-servers.net.\ncom.                    172800  IN  NS  a.gtld-servers.net.\ngoogle.com.             172800  IN  NS  ns1.google.com.\ngoogle.com.             300     IN  A   142.250.219.14',
      },
      { type: 'h2', text: '2. Conexão TCP (three-way handshake)' },
      {
        type: 'p',
        text: 'Com o IP em mãos, o navegador abre uma conexão TCP com o servidor na porta 443. Isso envolve três pacotes: SYN, SYN-ACK e ACK — o aperto de mão que garante que ambos os lados estão prontos para trocar dados de forma confiável.',
      },
      {
        type: 'list',
        items: [
          'SYN — cliente propõe iniciar a conexão e envia seu número de sequência inicial',
          'SYN-ACK — servidor confirma e propõe o seu próprio número de sequência',
          'ACK — cliente confirma, e a conexão está estabelecida',
        ],
      },
      { type: 'h2', text: '3. Handshake TLS' },
      {
        type: 'p',
        text: 'Para HTTPS, antes de qualquer dado da aplicação trafegar, cliente e servidor negociam uma sessão criptografada: trocam certificados, validam a cadeia de confiança e combinam as chaves de sessão via um algoritmo como ECDHE. Com TLS 1.3 isso leva apenas um round-trip.',
      },
      { type: 'h2', text: '4. Requisição e resposta HTTP' },
      {
        type: 'code',
        lang: 'http',
        text: 'GET / HTTP/1.1\nHost: google.com\nUser-Agent: Mozilla/5.0\nAccept: text/html\n\nHTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8\nContent-Length: 48924',
      },
      {
        type: 'p',
        text: 'O servidor processa a requisição, monta a resposta e devolve o HTML. Dali em diante o navegador faz o parsing, descobre novos recursos (CSS, JS, imagens) e repete boa parte desse ciclo para cada um — muitas vezes reaproveitando a mesma conexão TCP graças ao keep-alive.',
      },
      {
        type: 'quote',
        text: 'Cada camada resolve um problema específico — e é exatamente essa separação de responsabilidades que torna a internet tão resiliente.',
      },
      { type: 'h2', text: '5. Renderização' },
      {
        type: 'p',
        text: 'Por fim, o navegador constrói o DOM, calcula estilos (CSSOM), monta a árvore de renderização e pinta os pixels na tela. Tudo isso, do zero, geralmente em menos de um segundo.',
      },
    ],
  },
  {
    slug: 'tcp-vs-udp',
    title: 'TCP vs UDP: quando usar cada um',
    excerpt:
      'Confiabilidade ou velocidade? Entenda as diferenças reais entre os dois protocolos de transporte e em quais cenários cada um faz sentido.',
    linkedinVersion:
      'TCP ou UDP? A resposta certa é: depende do que você não pode perder.\n\nTCP garante entrega ordenada e confirmada — ideal para HTTP, e-mail, transferência de arquivos.\nUDP não garante nada disso, mas é rápido e leve — perfeito para streaming, VoIP, jogos e DNS.\n\nA regra de ouro: se um pacote atrasado é pior que um pacote perdido, use UDP. Se perder um byte quebra tudo, use TCP.\n\nDetalhei os dois protocolos (com exemplos de cabeçalho e casos reais) no blog 👇\n\n#redes #tcp #udp #networking',
    date: '2026-09-03',
    readTime: 6,
    tags: ['TCP', 'UDP', 'Camada de Transporte'],
    status: 'published',
    publishedOn: ['blog', 'linkedin'],
    content: [
      {
        type: 'p',
        text: 'TCP e UDP vivem na camada de transporte, mas resolvem o mesmo problema — levar dados de um processo a outro — com filosofias opostas.',
      },
      { type: 'h2', text: 'TCP: confiabilidade acima de tudo' },
      {
        type: 'list',
        items: [
          'Orientado a conexão (handshake antes de trocar dados)',
          'Entrega garantida e em ordem, com retransmissão automática',
          'Controle de fluxo e controle de congestionamento',
          'Overhead maior: cabeçalho de 20+ bytes e round-trips extras',
        ],
      },
      { type: 'h2', text: 'UDP: velocidade acima de tudo' },
      {
        type: 'list',
        items: [
          'Sem conexão — envia e esquece (fire and forget)',
          'Sem garantia de entrega, ordem ou duplicação',
          'Cabeçalho enxuto de apenas 8 bytes',
          'Ideal quando dados atrasados já não servem para nada',
        ],
      },
      { type: 'h2', text: 'Na prática' },
      {
        type: 'p',
        text: 'Uma chamada de vídeo prefere perder um frame a esperar a retransmissão dele — quando ele chegasse, a cena já teria mudado. Já uma transferência bancária não pode perder nem reordenar um único byte. Esse é o cerne da escolha.',
      },
      {
        type: 'code',
        lang: 'text',
        text: 'Cabeçalho UDP (8 bytes)\n+-------------+-------------+\n| Porta Origem| Porta Destino|\n+-------------+-------------+\n|  Tamanho    |  Checksum   |\n+-------------+-------------+',
      },
    ],
  },
  {
    slug: 'como-funciona-o-bgp',
    title: 'Como funciona o roteamento BGP',
    excerpt:
      'O protocolo que literalmente mantém a internet de pé. Entenda como sistemas autônomos trocam rotas e por que um erro de configuração pode derrubar meio mundo.',
    linkedinVersion:
      'O BGP (Border Gateway Protocol) é, sem exagero, o protocolo que segura a internet inteira.\n\nEle é responsável por decidir o caminho que seus dados percorrem entre provedores diferentes ao redor do mundo, através da troca de rotas entre Sistemas Autônomos (AS).\n\nO problema? Ele funciona na base da confiança. Um AS mal configurado pode anunciar rotas erradas e desviar (ou derrubar) tráfego de meio mundo — já aconteceu diversas vezes.\n\nFalei sobre como isso funciona na prática e por que soluções como RPKI existem 👇\n\n#redes #bgp #internet #infraestrutura',
    date: '2026-08-24',
    readTime: 7,
    tags: ['BGP', 'Roteamento', 'Internet'],
    status: 'published',
    publishedOn: ['blog', 'linkedin'],
    content: [
      {
        type: 'p',
        text: 'A internet não é uma rede única — é uma federação de mais de 70 mil Sistemas Autônomos (AS), cada um controlando seu próprio pedaço. O BGP é o protocolo que permite que eles anunciem uns aos outros quais redes conseguem alcançar.',
      },
      { type: 'h2', text: 'Sistemas Autônomos' },
      {
        type: 'p',
        text: 'Um AS é um conjunto de redes sob uma única política de roteamento — geralmente um provedor, uma grande empresa ou uma universidade. Cada um tem um número único (ASN) que o identifica globalmente.',
      },
      { type: 'h2', text: 'Anúncio de rotas' },
      {
        type: 'p',
        text: 'Quando um AS quer que o resto da internet saiba que ele hospeda determinado bloco de IPs, ele anuncia esse prefixo aos seus vizinhos via BGP. Cada vizinho propaga o anúncio adiante, adicionando o caminho de ASes percorrido (AS-PATH) — é assim que rotas se espalham pelo mundo.',
      },
      {
        type: 'code',
        lang: 'text',
        text: 'Anúncio recebido para 142.250.0.0/16\nAS-PATH: 65001 6939 15169\n\nSignifica: o prefixo passou pelo AS 65001,\nque aprendeu com o AS 6939, que aprendeu\ndiretamente do AS de origem (15169 = Google).',
      },
      { type: 'h2', text: 'O problema da confiança' },
      {
        type: 'p',
        text: 'BGP foi desenhado nos anos 80 sem autenticação forte. Qualquer AS pode, por erro ou má-fé, anunciar um prefixo que não é seu — um "sequestro de rota" (route hijack). Isso já desviou tráfego de bancos inteiros e chegou a tirar serviços globais do ar por horas.',
      },
      {
        type: 'quote',
        text: 'RPKI (Resource Public Key Infrastructure) existe justamente para resolver isso: assina criptograficamente quem tem o direito de anunciar cada prefixo.',
      },
    ],
  },
  {
    slug: 'subnetting-sem-dor',
    title: 'Subnetting sem dor: dividindo redes em sub-redes',
    excerpt:
      'Um método visual e direto para calcular sub-redes sem decorar tabela — com exemplos usando CIDR do dia a dia.',
    linkedinVersion:
      'Subnetting assusta no começo, mas o truque é simples: tudo gira em torno de "quantos hosts eu preciso" e "quantas redes eu preciso".\n\nUma /24 (255.255.255.0) dá 254 hosts utilizáveis. Se eu preciso de só 30 hosts por rede, uma /27 já resolve — e eu ainda ganho várias sub-redes a mais pra usar em outros lugares.\n\nMontei um passo a passo visual de como calcular isso na mão, sem decoreba, usando a notação CIDR 👇\n\n#redes #subnetting #cidr #ipv4',
    date: '2026-08-15',
    readTime: 9,
    tags: ['Subnetting', 'CIDR', 'IPv4'],
    status: 'published',
    publishedOn: ['blog'],
    content: [
      {
        type: 'p',
        text: 'Subnetting é dividir um bloco de endereços IP maior em blocos menores — para isolar tráfego, organizar departamentos, ou simplesmente não desperdiçar endereços.',
      },
      { type: 'h2', text: 'A notação CIDR' },
      {
        type: 'p',
        text: 'O número depois da barra (ex: /24) indica quantos bits da máscara são fixos para a "rede". Os bits restantes ficam livres para endereçar hosts.',
      },
      {
        type: 'list',
        items: [
          '/24 → 8 bits de host → 256 endereços → 254 hosts utilizáveis',
          '/25 → 7 bits de host → 128 endereços → 126 hosts utilizáveis',
          '/27 → 5 bits de host → 32 endereços → 30 hosts utilizáveis',
          '/30 → 2 bits de host → 4 endereços → 2 hosts (clássico link ponto a ponto)',
        ],
      },
      { type: 'h2', text: 'Método prático' },
      {
        type: 'p',
        text: 'Pergunte primeiro: "quantos hosts eu preciso na maior sub-rede?". Some 2 (rede e broadcast) e encontre a potência de 2 mais próxima acima. Isso te dá o tamanho do bloco e, por consequência, a máscara.',
      },
      {
        type: 'code',
        lang: 'text',
        text: 'Preciso de 30 hosts numa sub-rede.\n30 + 2 = 32 = 2^5\n→ 5 bits de host → /27 (255.255.255.224)\n\nBloco 192.168.1.0/27:\nRede:      192.168.1.0\nHosts:     192.168.1.1 – 192.168.1.30\nBroadcast: 192.168.1.31',
      },
      {
        type: 'p',
        text: 'Repita o processo para as próximas sub-redes, sempre avançando pelo bloco anterior. Com prática isso vira automático — e você para de precisar de calculadora.',
      },
    ],
  },
  {
    slug: 'redes-definidas-por-software-sdn',
    title: 'Redes Definidas por Software (SDN): separando o cérebro da rede do encaminhamento',
    excerpt:
      'Rascunho em andamento: como SDN desacopla o plano de controle do plano de dados e por que isso muda a forma de operar data centers inteiros.',
    linkedinVersion:
      'Ainda escrevendo esse — em breve compartilho por aqui! Se você trabalha com SDN/OpenFlow no dia a dia, me conta sua experiência nos comentários 👇\n\n#redes #sdn #datacenter',
    date: '2026-09-14',
    readTime: 5,
    tags: ['SDN', 'OpenFlow', 'Data Center'],
    status: 'draft',
    publishedOn: [],
    content: [
      {
        type: 'p',
        text: 'Em redes tradicionais, cada switch e roteador decide sozinho como encaminhar pacotes, com base em protocolos distribuídos rodando localmente. SDN propõe outra abordagem.',
      },
      { type: 'h2', text: 'Plano de controle vs. plano de dados' },
      {
        type: 'p',
        text: 'SDN separa a "inteligência" (plano de controle) do "trabalho braçal" de encaminhar pacotes (plano de dados). Um controlador centralizado enxerga a rede como um todo e programa os switches via um protocolo como o OpenFlow.',
      },
      { type: 'quote', text: '[continuar rascunho — comparar com arquitetura tradicional distribuída]' },
    ],
  },
]
