// Página inicial — hero com tipografia serifada de destaque + vitrine de receitas.
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { ReceitaResumo } from '../types';
import CardReceita from '../components/CardReceita';
// ... garanta que seus componentes de estilo (Hero, Titulo, etc.) estejam importados abaixo

export default function Home() {
  const [receitas, setReceitas] = useState<ReceitaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const API_KEY = "557de85a06184ce0b626fae66b9671a1";

  useEffect(() => {
    async function carregarReceitas() {
      try {
        setErro(null);

        // 1. CHECA SE JÁ EXISTE CACHE SALVO
        const cache = localStorage.getItem('@GuiltFree:receitasHome');
        if (cache) {
          const receitasSalvas = JSON.parse(cache);
          if (Array.isArray(receitasSalvas) && receitasSalvas.length > 12) {
            console.log("Pegando receitas direto do localStorage! Economizando API...");
            setReceitas(receitasSalvas);
            setLoading(false);
            return; // 🛑 Para aqui e não faz o fetch se achar dados salvos!
          }
        }

        // 2. SE NÃO TIVER CACHE, FAZ O FETCH SÓ UMA VEZ
        console.log("Nenhum cache encontrado. Disparando fetch para a Spoonacular...");
        setLoading(true);

        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&diet=vegan,vegetarian&intolerances=gluten,dairy&number=50&fillIngredients=true&addRecipeInformation=true`
        );

        console.log("Resposta da API recebida. Status:", response.status);

        if (!response.ok) {
          throw new Error(`Erro na API Spoonacular: Status ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const recipesFormatadas: ReceitaResumo[] = data.results.map((item: any) => ({
            id: item.id,
            titulo: item.title || "",
            imagemUrl: item.image || "",
            tempoPreparoMin: item.readyInMinutes || 30,
            porcoes: item.servings || 2,
            resumo: item.summary ? item.summary.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : "",
            ingredientesPreview: item.extendedIngredients?.map((ing: any) => ing.name) || []
          }));

          setReceitas(recipesFormatadas);
          // Salva no cache para a próxima renderização não gastar pontos
          localStorage.setItem('@GuiltFree:receitasHome', JSON.stringify(recipesFormatadas));
        } else {
          setErro("A API retornou uma lista vazia de receitas.");
        }
      } catch (error: any) {
        console.error("Erro capturado no useEffect da Home:", error);
        setErro(error.message || "Erro inesperado ao conectar com o serviço de receitas.");
      } finally {
        setLoading(false);
      }
    }

    carregarReceitas();
  }, []); // Mantém vazio para rodar apenas uma vez ao montar a tela

  return (
    <>
      <Hero>
        <Subtitulo>Receitas sem culpa</Subtitulo>
        <Titulo>Comer bem é<br /><em>um ato simples.</em></Titulo>
        <Descricao>
          Um catálogo curado de pratos saudáveis e elegantes para o seu dia a dia.
        </Descricao>
        <CTA to="/busca">Explorar receitas</CTA>
      </Hero>

      <Vitrine>
        <VitrineCabecalho>
          <VitrineRotulo>Em destaque</VitrineRotulo>
          <VitrineTitulo>Inspirações <em>para hoje</em></VitrineTitulo>
        </VitrineCabecalho>

        <Grid>
          {/* 2. Se estiver buscando na API, você pode colocar uma mensagem elegante ou esqueleto de loading */}
          {loading ? (
            <LoadingTexto>Buscando receitas saudáveis...</LoadingTexto>
          ) : (
            // 3. Mapeia o estado dinâmico 'receitas' em vez do mock estático
            receitas.map((r) => (
              <CardReceita key={r.id} receita={r} />
            ))
          )}
        </Grid>
      </Vitrine>
    </>
  );
}

// --- SEUS COMPONENTES ESTILIZADOS SEGUEM ABAIXO SEM ALTERAÇÕES DE LAYOUT ---

const Hero = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos['3xl']} ${({ theme }) => theme.espacos.lg};
  text-align: center;
`;

const Subtitulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.md};
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  margin-bottom: ${({ theme }) => theme.espacos.lg};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['4xl']};
  }
`;

const Descricao = styled.p`
  font-size: ${({ theme }) => theme.tamanhosFonte.lg};
  color: ${({ theme }) => theme.cores.texto.secundario};
  margin-bottom: ${({ theme }) => theme.espacos.xl};
`;

const CTA = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.xl};
  border-radius: ${({ theme }) => theme.bordas.pill};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.cores.texto.secundario};
  }
`;

const Vitrine = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacos.xl} ${({ theme }) => theme.espacos.lg}
    ${({ theme }) => theme.espacos['3xl']};
`;

const VitrineCabecalho = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};
`;

const VitrineRotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.sm};
`;

const VitrineTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  color: ${({ theme }) => theme.cores.texto.primario};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.espacos.lg};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

// Adicionado apenas um estilo básico para o texto de carregamento que combine com o tema da sua colega
const LoadingTexto = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  font-family: ${({ theme }) => theme.fontes.corpo};
  color: ${({ theme }) => theme.cores.texto.secundario};
  font-size: ${({ theme }) => theme.tamanhosFonte.lg};
  padding: ${({ theme }) => theme.espacos.xl} 0;
`;