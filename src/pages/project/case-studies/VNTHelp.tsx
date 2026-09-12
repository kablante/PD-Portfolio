import { PendingImage, PendingMetric } from '@/components/shared/Pending'
import { skillHue } from '../../home/skills'

const PROJECT_SKILLS = [
  'AI-Assisted Design Workflows',
  'GitHub',
  'Enterprise UX Design',
  'Cross-functional Collaboration',
  'User Research',
]

/** Venturus Help Page & AI Chatbot — case study draft. Several screenshots
 * and metrics are still pending Venturus's disclosure/NDA clearance; those
 * spots render as marked placeholders (PendingImage/PendingMetric) instead
 * of being skipped, so the page's shape is honest about what's still to
 * come rather than looking finished or leaving unexplained gaps. */
export default function VNTHelp() {
  return (
    <>
      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Role</span>
            <span data-lang="pt">Função</span>
          </span>
          <span className="kb-project-meta-item__value">Product Designer</span>
        </span>

        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Timeline</span>
            <span data-lang="pt">Período</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">
              Rolled out gradually over the course of the project, worked in whenever the core roadmap had slack
            </span>
            <span data-lang="pt">
              Lançado gradualmente ao longo do projeto, encaixado sempre que o roadmap principal tinha folga
            </span>
          </span>
        </span>
      </div>

      <div className="kb-project-meta-row">
        <span className="kb-project-meta-item">
          <span className="kb-project-meta-item__label">
            <span data-lang="en">Team</span>
            <span data-lang="pt">Equipe</span>
          </span>
          <span className="kb-project-meta-item__value">
            <span data-lang="en">
              Data architecture, backend, frontend, QA, and design teams at{' '}
              <a
                href="https://www.linkedin.com/company/venturus/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Venturus
              </a>
              ; design partner{' '}
              <a href="https://www.linkedin.com/in/kauanedemoraes/" target="_blank" rel="noopener noreferrer">
                Kauane de Moraes
              </a>
            </span>
            <span data-lang="pt">
              Equipes de arquitetura de dados, backend, frontend, QA e design da{' '}
              <a
                href="https://www.linkedin.com/company/venturus/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Venturus
              </a>
              ; parceira de design{' '}
              <a href="https://www.linkedin.com/in/kauanedemoraes/" target="_blank" rel="noopener noreferrer">
                Kauane de Moraes
              </a>
            </span>
          </span>
        </span>
      </div>

      <div className="kb-project-skills">
        <span className="kb-project-skills__label">
          <span data-lang="en">✦ skills &amp; toolkit</span>
          <span data-lang="pt">✦ ferramentas</span>
        </span>

        {PROJECT_SKILLS.map((label) => (
          <span key={label} className={`kb-project-skill kb-project-skill--${skillHue(label)}`}>
            {label}
          </span>
        ))}
      </div>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Overview</span>
          <span data-lang="pt">Visão Geral</span>
        </span>

        <PendingImage>
          <span data-lang="en">Overview image pending from Venturus.</span>
          <span data-lang="pt">Imagem da visão geral pendente da Venturus.</span>
        </PendingImage>

        <p>
          <span data-lang="en">
            At Venturus, working with a hardware manufacturing client, I rebuilt the product's User Guide (Help)
            page and added an in-product AI chatbot.{' '}
            <PendingMetric>Lead metric pending Venturus disclosure/NDA clearance</PendingMetric>
          </span>
          <span data-lang="pt">
            Na Venturus, trabalhando com um cliente fabricante de hardware, reconstruí o Guia do Usuário (Help) do
            produto e adicionei um chatbot de IA dentro do produto.{' '}
            <PendingMetric>Métrica principal pendente de liberação de disclosure/NDA da Venturus</PendingMetric>
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Problem</span>
          <span data-lang="pt">Problema</span>
        </span>

        <p>
          <span data-lang="en">
            The existing Help page had very low traffic. Many users didn't even know it existed, a fact that
            surfaced during user interviews conducted for an unrelated, complex feature, and the team routinely
            deprioritized the page as a result. That stopped being a minor issue once new engineering teams joined
            as users and increasingly complex features started shipping to production, both raised the real cost of
            an outdated, hard-to-find help system.
          </span>
          <span data-lang="pt">
            A página de Help existente tinha pouquíssimo tráfego. Muitos usuários nem sabiam que ela existia, um
            fato que surgiu durante entrevistas feitas para uma feature complexa e não relacionada, e o time
            normalmente despriorizava a página por causa disso. Isso deixou de ser um problema pequeno quando novos
            times de engenharia passaram a usar o produto e features cada vez mais complexas começaram a ir para
            produção — os dois fatores aumentaram o custo real de um sistema de ajuda desatualizado e difícil de
            encontrar.
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Solution</span>
          <span data-lang="pt">Solução</span>
        </span>

        <p>
          <span data-lang="en">
            I rebuilt the Help page and added an in-product AI chatbot that answers questions directly from the Help
            content.{' '}
            <PendingMetric>Outcome statement pending Venturus disclosure/NDA clearance</PendingMetric>
          </span>
          <span data-lang="pt">
            Reconstruí a página de Help e adicionei um chatbot de IA dentro do produto que responde perguntas
            diretamente a partir do conteúdo do Help.{' '}
            <PendingMetric>Resultado pendente de liberação de disclosure/NDA da Venturus</PendingMetric>
          </span>
        </p>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Process</span>
          <span data-lang="pt">Processo</span>
        </span>

        <h2>
          <span data-lang="en">Approach</span>
          <span data-lang="pt">Abordagem</span>
        </h2>
        <p>
          <span className="kb-project-highlight">
            <span data-lang="en">
              I rebuilt the page using AI-assisted development, working in VS Code and GitHub with Claude Code.
            </span>
            <span data-lang="pt">
              Reconstruí a página usando desenvolvimento assistido por IA, trabalhando no VS Code e GitHub com o
              Claude Code.
            </span>
          </span>
        </p>

        <h3>
          <span data-lang="en">The Skill</span>
          <span data-lang="pt">A Skill</span>
        </h3>
        <p>
          <span data-lang="en">
            To keep the guide's content consistent and current, I created a Skill that converts three kinds of
            source material (technical requirements from developers and data architects, design case studies from
            the design team, and QA test cases), into Help entries written in plain, objective language. It uses the
            same terminology the product itself displays, knows which technical terms to drop entirely, and
            translates the rest into user-friendly language.
          </span>
          <span data-lang="pt">
            Para manter o conteúdo do guia consistente e atualizado, criei uma Skill que converte três tipos de
            material de origem (requisitos técnicos de desenvolvedores e arquitetos de dados, estudos de caso de
            design do time de design, e casos de teste de QA) em entradas de Help escritas em linguagem simples e
            objetiva. Ela usa a mesma terminologia que o produto exibe, sabe quais termos técnicos descartar
            completamente, e traduz o resto para uma linguagem amigável ao usuário.
          </span>
        </p>
        <p>
          <span data-lang="en">
            In practice, that meant opening Claude Code inside the Help page project in VS Code, already connected
            to the requirements plugin, and typing something as simple as{' '}
            <span className="kb-project-highlight">"make the Help page for Feature X."</span> Claude Code would
            generate the text and specify exactly which screenshots needed to be taken from the application to
            complete the page.
          </span>
          <span data-lang="pt">
            Na prática, isso significava abrir o Claude Code dentro do projeto da página de Help no VS Code, já
            conectado ao plugin de requisitos, e digitar algo tão simples quanto{' '}
            <span className="kb-project-highlight">"faz a página de Help da Feature X."</span> O Claude Code gerava
            o texto e especificava exatamente quais capturas de tela precisavam ser tiradas da aplicação para
            completar a página.
          </span>
        </p>

        <h3>
          <span data-lang="en">Information Architecture</span>
          <span data-lang="pt">Arquitetura da Informação</span>
        </h3>
        <p>
          <span data-lang="en">
            The new version added global search and per-page search, a rebuilt hierarchy for easier navigation, and
            a hyperlink system that lets pages reference a single source of information instead of repeating it. It
            also added dedicated guides for environment setup, requesting access, and the differences between user
            types.
          </span>
          <span data-lang="pt">
            A nova versão adicionou busca global e busca por página, uma hierarquia reconstruída para navegação mais
            fácil, e um sistema de hyperlinks que permite que páginas referenciem uma única fonte de informação em
            vez de repeti-la. Também foram adicionados guias dedicados para configuração de ambiente, solicitação de
            acesso, e as diferenças entre tipos de usuário.
          </span>
        </p>

        <h3>
          <span data-lang="en">The Image Problem</span>
          <span data-lang="pt">O Problema das Imagens</span>
        </h3>
        <p>
          <span data-lang="en">
            Full-page screenshots, videos, and GIFs went stale almost immediately, since the product shipped every
            sprint. There was a second constraint on top of that: fictional placeholder data confused users, but the
            company's confidentiality policy didn't allow real data to be shown. My solution was to use tightly
            cropped images focused on the single element referenced in the text, instead of full-page captures. The
            new search and hierarchy system also made it easier to see exactly where a UI change would affect the
            guide, and building with Claude Code made updating those cropped images faster.
          </span>
          <span data-lang="pt">
            Capturas de tela de página inteira, vídeos e GIFs ficavam desatualizados quase imediatamente, já que o
            produto lançava atualizações a cada sprint. Havia uma segunda restrição além dessa: dados fictícios de
            placeholder confundiam os usuários, mas a política de confidencialidade da empresa não permitia mostrar
            dados reais. Minha solução foi usar imagens recortadas de perto, focadas no único elemento referenciado
            no texto, em vez de capturas de página inteira. O novo sistema de busca e hierarquia também facilitou
            enxergar exatamente onde uma mudança de UI afetaria o guia, e construir com o Claude Code tornou a
            atualização dessas imagens recortadas mais rápida.
          </span>
        </p>

        <h3>
          <span data-lang="en">The Chatbot</span>
          <span data-lang="pt">O Chatbot</span>
        </h3>
        <p>
          <span data-lang="en">
            The chatbot lives inside the product and{' '}
            <span className="kb-project-highlight">answers questions using the Help content directly</span>. It
            draws on each user's individual token allocation within the company, consistent with the closed,
            disclosure-limited access model the project already used for other initiatives.
          </span>
          <span data-lang="pt">
            O chatbot vive dentro do produto e{' '}
            <span className="kb-project-highlight">responde perguntas usando o conteúdo do Help diretamente</span>.
            Ele consome da alocação individual de tokens de cada usuário dentro da empresa, de forma consistente com
            o modelo de acesso fechado e limitado por disclosure que o projeto já usava em outras iniciativas.
          </span>
        </p>

        <PendingImage>
          <span data-lang="en">Chatbot screenshots pending from Venturus.</span>
          <span data-lang="pt">Capturas de tela do chatbot pendentes da Venturus.</span>
        </PendingImage>

        <h3>
          <span data-lang="en">Guidelines</span>
          <span data-lang="pt">Diretrizes</span>
        </h3>
        <p>
          <span data-lang="en">
            Beyond the Skill above, two more guideline documents governed how the Help page was maintained:
          </span>
          <span data-lang="pt">
            Além da Skill acima, mais dois documentos de diretrizes regiam como a página de Help era mantida:
          </span>
        </p>
        <ul className="kb-project-list">
          <li>
            <span data-lang="en">
              <span className="kb-project-highlight">UX writing guidelines</span>, matching the tone of voice and
              phrasing conventions of the company the software was built for.
            </span>
            <span data-lang="pt">
              <span className="kb-project-highlight">Diretrizes de UX writing</span>, alinhadas ao tom de voz e às
              convenções de linguagem da empresa para a qual o software foi construído.
            </span>
          </li>
          <li>
            <span data-lang="en">
              Standard behavior rules: when to hyperlink instead of repeating information, both for user roles and
              for technical terms, defined behavior patterns for structuring content, three rules for how
              screenshots should be cropped and used, and a standing rule to add any new term to the page's
              glossary.
            </span>
            <span data-lang="pt">
              Regras padrão de comportamento: quando usar hyperlink em vez de repetir informação, tanto para papéis
              de usuário quanto para termos técnicos, padrões de comportamento definidos para estruturar conteúdo,
              três regras de como capturas de tela devem ser recortadas e usadas, e uma regra permanente de
              adicionar qualquer termo novo ao glossário da página.
            </span>
          </li>
        </ul>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Final Design</span>
          <span data-lang="pt">Design Final</span>
        </span>

        <h2>
          <span data-lang="en">Before</span>
          <span data-lang="pt">Antes</span>
        </h2>
        <PendingImage>
          <span data-lang="en">Old Help home screen and old internal screens pending from Venturus.</span>
          <span data-lang="pt">
            Tela inicial antiga do Help e telas internas antigas pendentes da Venturus.
          </span>
        </PendingImage>

        <h2>
          <span data-lang="en">After</span>
          <span data-lang="pt">Depois</span>
        </h2>
        <PendingImage>
          <span data-lang="en">
            New Help home screen with search bar, new menus, and new internal screens pending from Venturus.
          </span>
          <span data-lang="pt">
            Nova tela inicial do Help com barra de busca, novos menus, e novas telas internas pendentes da Venturus.
          </span>
        </PendingImage>
      </section>

      <section className="kb-project-section">
        <span className="kb-project-section__eyebrow">
          <span data-lang="en">Product Successes</span>
          <span data-lang="pt">Resultados do Produto</span>
        </span>

        <div className="kb-project-stats">
          <div>
            <span className="kb-project-stats__value">—</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">
                Help page access, before → after —{' '}
                <PendingMetric>Pending Venturus disclosure/NDA clearance</PendingMetric>
              </span>
              <span data-lang="pt">
                Acessos à página de Help, antes → depois —{' '}
                <PendingMetric>Pendente de liberação de disclosure/NDA da Venturus</PendingMetric>
              </span>
            </span>
          </div>
          <div>
            <span className="kb-project-stats__value">—</span>
            <span className="kb-project-stats__label">
              <span data-lang="en">
                Chatbot usage in production —{' '}
                <PendingMetric>Pending Venturus disclosure/NDA clearance</PendingMetric>
              </span>
              <span data-lang="pt">
                Uso do chatbot em produção —{' '}
                <PendingMetric>Pendente de liberação de disclosure/NDA da Venturus</PendingMetric>
              </span>
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
