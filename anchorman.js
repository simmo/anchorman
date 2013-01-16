(function($) {
  
  function Anchorman(element, options) {
    var process = $.proxy(this.process, this);
    this.options = $.extend({}, { selector: '[data-anchor]', offset: 50 }, options);
    this.activeTarget;
    this.$container = $(element).is('body') ? $(window) : $(element);
    this.$container.on('scroll.annchorman', process);
    
    this.$body = $('body');
    
    this.refresh();
    this.process();
  }
  
  Anchorman.prototype = {
    constructor: Anchorman,
    refresh: function() {
      var self = this;
      
      this.$links = this.$body.find('[href^="#"]');
      this.offsets = $([]);
      this.targets = $([]);
      
      this.$body.find(this.options.selector)
        .map(function() { return [[$(this).position().top, this]]; })
        .sort(function(a, b) { return a[0] - b[0]; })
        .each(function() {
          self.offsets.push(this[0]);
          self.targets.push(this[1]);
        });
    },
    process: function() {
      
      var 
        scrollTop = this.$container.scrollTop() + this.options.offset,
        scrollHeight = this.$container[0].scrollHeight || this.$body[0].scrollHeight,
        maxScroll = scrollHeight - this.$container.height(),
        i;
      
      if (scrollTop >= maxScroll) {
        this.activeTarget != this.targets.last()[0] && this.activate(this.targets.last()[0]);
      } else {
        for (i = this.offsets.length; i--;) {
          if (this.activeTarget != this.targets[i]
            && scrollTop >= this.offsets[i]
            && (!this.offsets[i + 1] || scrollTop <= this.offsets[i + 1])
            && this.activate(this.targets[i], [i, scrollTop, this.offsets[i], this.activeTarget != this.targets[i], scrollTop >= this.offsets[i], !this.offsets[i + 1] || scrollTop <= this.offsets[i + 1]])) break;
        }
      }
      
    },
    activate: function(target, data) {
      this.activeTarget = target;
      
      this.$links.not('[href="#' + target.id + '"]').removeClass('is-current');
      this.$links.filter('[href="#' + target.id + '"]').addClass('is-current');
    }
  };
  
  $.fn.anchorman = function (option) {
    return this.each(function() {
      var $this = $(this), data = $this.data('anchorman'), options = typeof option == 'object' && option;
      
      if (!data) $this.data('anchorman', (data = new Anchorman(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };
  
})(jQuery);