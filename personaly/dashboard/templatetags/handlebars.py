from django import template
register = template.Library()


@register.filter
def handlebars(value):
    # str.format would require ugly escaping, so we use '%'
    return '{{%s}}' % value
