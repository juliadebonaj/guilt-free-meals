// Página inicial — hero com tipografia serifada de destaque + vitrine de receitas.
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import CardReceita from '../components/CardReceita';

// Caso sua API caia ou dê erro de limite diário, mantemos o mock como um plano B (fallback)
import { RECEITAS_DESTAQUE } from '../mocks';
import { ReceitaResumo } from '../types'; // <- Ajuste o caminho desse import se necessário

export default function Home() {
  const [receitas, setReceitas] = useState<ReceitaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 💡 ADICIONE ESSA LINHA AQUI PARA CORRIGIR O ERRO:
  const [erro, setErro] = useState<string | null>(null);

  const MIN_RECEITAS_ACEITAVEL = 4;
  const API_KEY = "fe9b369d70ec4b228ef58af6f5ca3bfc";

  useEffect(() => {
    async function carregarReceitas() {
      try {
        setErro(null);

        // 1. FORÇAR LIMPEZA DE CACHE ANTIGO (Pode remover essa linha após testar e funcionar!)
        // Isso garante que o navegador jogue fora o JSON que estava quebrado
        localStorage.removeItem('@GuiltFree:receitasHome');

        // 2. Busca da API da Spoonacular com os parâmetros extras para trazer ingredientes e tempo real
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&diet=vegan,vegetarian&intolerances=gluten,dairy&number=100&fillIngredients=true&addRecipeInformation=true`
        );
        
        if (!response.ok) {
          throw new Error("Não foi possível carregar as receitas da API.");
        }
        
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const receitasFormatadas: ReceitaResumo[] = data.results.map((item: any) => {
            
            // Pega os nomes dos ingredientes que a API retornou graças ao fillIngredients=true
            const ingredientes = item.extendedIngredients?.map((ing: any) => ing.name) || [];

            return {
              id: item.id,
              titulo: item.title || "",
              imagemUrl: item.image || "",
              tempoPreparoMin: item.readyInMinutes || 30, 
              porcoes: item.servings || 2,
              // Remove tags HTML que a Spoonacular costuma mandar no summary
              resumo: item.summary ? item.summary.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : "", 
              ingredientesPreview: ingredientes // <-- Aqui está o que o Card precisa!
            };
          });

          setReceitas(receitasFormatadas);
          localStorage.setItem('@GuiltFree:receitasHome', JSON.stringify(receitasFormatadas));
        } else {
          setErro("Nenhuma receita encontrada.");
        }
      } catch (error: any) {
        console.error("Erro ao carregar as receitas:", error);
        setErro(error.message || "Ocorreu um erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    carregarReceitas();
  }, []);

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