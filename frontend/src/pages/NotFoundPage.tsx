import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { ButtonLink } from '../components/shared/Button'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." path="/404" />
      <PageHeader eyebrow="404" title="This page has checked out" description="The page you were looking for isn’t here. Let’s get you back to something comfortable." />
      <section className="container-x py-16 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/rooms" variant="outline">
            Browse rooms
          </ButtonLink>
        </div>
      </section>
    </>
  )
}