# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "contrast"
  spec.version       = "1.3.1f"
  spec.authors       = ["Chris Nicholson"]
  spec.email         = ["datapolitical@gmail.com"]

  spec.summary       = %q{A short explanation of my awesome gem theme.}
  spec.description   = "A longer explanation of my awesome gem theme that isn’t the same as my summary."
  spec.homepage      = "https://www.chrisfnicholson.com"
  spec.license       = "MIT"

  spec.files         = git ls-files -z.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|recipes|drinks|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.0"

  spec.add_development_dependency "jekyll", "~> 3.3"
  spec.add_development_dependency "bundler", "~> 1.12"
end
