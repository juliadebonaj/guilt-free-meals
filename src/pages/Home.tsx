// Página inicial — hero com tipografia serifada de destaque + vitrine de receitas.
// Mostra 3 receitas aleatórias do pool inicial. O pool fica permanentemente
// em localStorage (compartilhado com /busca): se já está lá, não chamamos a API.
// Fallback pros mocks se a primeira request falhar.

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import type { ReceitaResumo } from '../types';
import CardReceita from '../components/CardReceita';
import Spinner from '../components/Spinner';
import { buscarPoolInicial } from '../spoonacular';
import { lerPoolCache, gravarPoolCache } from '../poolCache';
import { RECEITAS_DESTAQUE } from '../mocks';

const QUANTIDADE_HOME = 3;

// Sorteia N itens aleatórios sem repetição (Fisher–Yates parcial)
function escolherAleatorias<T>(lista: T[], n: number): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

export default function Home() {
  const [receitas, setReceitas] = useState<ReceitaResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      // 1. Sempre prioriza o cache local
      const cache = lerPoolCache();
      if (cache && cache.length >= QUANTIDADE_HOME) {
        if (cancelado) return;
        setReceitas(escolherAleatorias(cache, QUANTIDADE_HOME));
        setCarregando(false);
        return;
      }

      // 2. Cache vazio → busca o pool inicial da API (1 única vez na vida do user)
      try {
        const pool = await buscarPoolInicial(100);
        if (cancelado) return;
        if (pool.length > 0) {
          gravarPoolCache(pool);
          setReceitas(escolherAleatorias(pool, QUANTIDADE_HOME));
        } else {
          setReceitas(escolherAleatorias(RECEITAS_DESTAQUE, QUANTIDADE_HOME));
        }
      } catch {
        // 3. API falhou (sem chave, quota, offline) → mocks
        if (cancelado) return;
        setReceitas(escolherAleatorias(RECEITAS_DESTAQUE, QUANTIDADE_HOME));
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <>
      <Hero>
        <Subtitulo>Guilt-Free Recipes</Subtitulo>
        <Titulo>Eating well is<br /><em>a simple act.</em></Titulo>
        <Descricao>
          A curated catalog of healthy, elegant dishes for your everyday.
        </Descricao>
        <CTA to="/busca">Explore Recipes</CTA>
      </Hero>

      <Vitrine>
        <VitrineCabecalho>
          <VitrineRotulo>Featured</VitrineRotulo>
          <VitrineTitulo>Inspiration <em>for today</em></VitrineTitulo>
        </VitrineCabecalho>

        {carregando ? (
          <Spinner />
        ) : (
          <Grid>
            {receitas.map((r) => (
              <CardReceita key={r.id} receita={r} />
            ))}
          </Grid>
        )}
      </Vitrine>
    </>
  );
}

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
